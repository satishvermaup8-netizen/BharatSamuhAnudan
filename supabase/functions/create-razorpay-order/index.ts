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
    const { amount, groupId, type, metadata } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating Razorpay order for user ${user.id}, amount: ₹${amount}`);

    // Create transaction record first
    const { data: transaction, error: txError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        group_id: groupId,
        amount: amount,
        type: type || 'installment',
        status: 'pending',
        payment_method: 'razorpay',
        metadata: metadata || {},
      })
      .select()
      .single();

    if (txError) {
      console.error('Transaction creation error:', txError);
      throw new Error(`Database: ${txError.message}`);
    }

    // Initialize Razorpay client
    const razorpay = new RazorpayClient(
      Deno.env.get('RAZORPAY_KEY_ID') ?? '',
      Deno.env.get('RAZORPAY_KEY_SECRET') ?? ''
    );

    // Create Razorpay order (amount in paise)
    const order = await razorpay.createOrder({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `txn_${transaction.id.slice(0, 8)}`,
      notes: {
        transaction_id: transaction.id,
        user_id: user.id,
        type: type || 'installment',
      },
    });

    console.log('Razorpay order created:', order.id);

    // Create payment record
    const { error: paymentError } = await supabaseClient
      .from('payment_records')
      .insert({
        transaction_id: transaction.id,
        razorpay_order_id: order.id,
        amount: amount,
        currency: 'INR',
        status: 'created',
        email: user.email,
        metadata: { order },
      });

    if (paymentError) {
      console.error('Payment record error:', paymentError);
    }

    // Update transaction with order ID
    await supabaseClient
      .from('transactions')
      .update({ razorpay_order_id: order.id })
      .eq('id', transaction.id);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        transactionId: transaction.id,
        amount: amount,
        currency: 'INR',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Order creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create order' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
