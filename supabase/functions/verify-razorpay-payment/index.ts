import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';
import { RazorpayClient } from '../_shared/razorpay.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { orderId, paymentId, signature, transactionId } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return new Response(
        JSON.stringify({ error: 'Missing payment verification data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Verifying payment for transaction ${transactionId}`);

    // Initialize Razorpay client
    const razorpay = new RazorpayClient(
      Deno.env.get('RAZORPAY_KEY_ID') ?? '',
      Deno.env.get('RAZORPAY_KEY_SECRET') ?? ''
    );

    // Verify signature
    const isValid = razorpay.verifyPaymentSignature(orderId, paymentId, signature);

    if (!isValid) {
      console.error('Invalid payment signature');
      return new Response(
        JSON.stringify({ error: 'Invalid payment signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment signature verified successfully');

    // Fetch payment details from Razorpay
    const payment = await razorpay.fetchPayment(paymentId);

    // Use service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get transaction details
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .select('*, group_id')
      .eq('id', transactionId)
      .single();

    if (txError) {
      console.error('Transaction fetch error:', txError);
      throw new Error(`Database: ${txError.message}`);
    }

    // Update transaction status
    await supabaseAdmin
      .from('transactions')
      .update({
        status: 'completed',
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        completed_at: new Date().toISOString(),
      })
      .eq('id', transactionId);

    // Update payment record
    await supabaseAdmin
      .from('payment_records')
      .update({
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        status: 'captured',
        payment_method: payment.method,
        paid_at: new Date().toISOString(),
        metadata: { payment },
      })
      .eq('razorpay_order_id', orderId);

    // Create wallet split (₹100 → ₹20 staff, ₹50 group, ₹10 consolidated, ₹20 management)
    const amount = transaction.amount;
    const split = {
      staff: amount * 0.20,
      group: amount * 0.50,
      consolidated: amount * 0.10,
      management: amount * 0.20,
    };

    console.log('Processing wallet split:', split);

    // Get or create user's staff wallet
    let { data: staffWallet } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'staff')
      .single();

    if (!staffWallet) {
      const { data: newWallet } = await supabaseAdmin
        .from('wallets')
        .insert({ user_id: user.id, type: 'staff', balance: 0 })
        .select()
        .single();
      staffWallet = newWallet;
    }

    // Get or create group wallet (if group_id exists)
    let groupWallet = null;
    if (transaction.group_id) {
      const { data: gw } = await supabaseAdmin
        .from('wallets')
        .select('*')
        .eq('group_id', transaction.group_id)
        .eq('type', 'group')
        .single();

      if (!gw) {
        const { data: newWallet } = await supabaseAdmin
          .from('wallets')
          .insert({ group_id: transaction.group_id, type: 'group', balance: 0 })
          .select()
          .single();
        groupWallet = newWallet;
      } else {
        groupWallet = gw;
      }
    }

    // Get or create consolidated wallet
    let { data: consolidatedWallet } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('type', 'consolidated')
      .is('user_id', null)
      .is('group_id', null)
      .single();

    if (!consolidatedWallet) {
      const { data: newWallet } = await supabaseAdmin
        .from('wallets')
        .insert({ type: 'consolidated', balance: 0 })
        .select()
        .single();
      consolidatedWallet = newWallet;
    }

    // Get or create management wallet
    let { data: managementWallet } = await supabaseAdmin
      .from('wallets')
      .select('*')
      .eq('type', 'management')
      .is('user_id', null)
      .is('group_id', null)
      .single();

    if (!managementWallet) {
      const { data: newWallet } = await supabaseAdmin
        .from('wallets')
        .insert({ type: 'management', balance: 0 })
        .select()
        .single();
      managementWallet = newWallet;
    }

    // Update wallet balances
    await supabaseAdmin
      .from('wallets')
      .update({
        balance: staffWallet.balance + split.staff,
        total_received: staffWallet.total_received + split.staff,
        last_updated: new Date().toISOString(),
      })
      .eq('id', staffWallet.id);

    if (groupWallet) {
      await supabaseAdmin
        .from('wallets')
        .update({
          balance: groupWallet.balance + split.group,
          total_received: groupWallet.total_received + split.group,
          last_updated: new Date().toISOString(),
        })
        .eq('id', groupWallet.id);
    }

    await supabaseAdmin
      .from('wallets')
      .update({
        balance: consolidatedWallet.balance + split.consolidated,
        total_received: consolidatedWallet.total_received + split.consolidated,
        last_updated: new Date().toISOString(),
      })
      .eq('id', consolidatedWallet.id);

    await supabaseAdmin
      .from('wallets')
      .update({
        balance: managementWallet.balance + split.management,
        total_received: managementWallet.total_received + split.management,
        last_updated: new Date().toISOString(),
      })
      .eq('id', managementWallet.id);

    // Update installment if applicable
    if (transaction.type === 'installment') {
      await supabaseAdmin
        .from('installments')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString(),
          transaction_id: transactionId,
        })
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .limit(1);

      // Update group member installments count
      if (transaction.group_id) {
        const { data: member } = await supabaseAdmin
          .from('group_members')
          .select('installments_paid')
          .eq('user_id', user.id)
          .eq('group_id', transaction.group_id)
          .single();

        if (member) {
          await supabaseAdmin
            .from('group_members')
            .update({
              installments_paid: member.installments_paid + 1,
              last_payment_date: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('group_id', transaction.group_id);
        }
      }
    }

    console.log('Payment verification and wallet split completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        verified: true,
        transactionId: transactionId,
        walletSplit: split,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to verify payment' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
