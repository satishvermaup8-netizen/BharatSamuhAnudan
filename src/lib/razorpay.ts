import { supabase } from './supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  amount: number;
  groupId?: string;
  type?: 'installment' | 'donation' | 'membership' | 'renewal';
  metadata?: Record<string, any>;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

export class RazorpayService {
  private static RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_key';

  static loadScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  static async createOrder(options: RazorpayOptions) {
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: options.amount,
          groupId: options.groupId,
          type: options.type || 'installment',
          metadata: options.metadata,
        },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Order creation failed:', error);
      throw new Error(error.message || 'Failed to create payment order');
    }
  }

  static async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string,
    transactionId: string
  ) {
    try {
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
          orderId,
          paymentId,
          signature,
          transactionId,
        },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Payment verification failed:', error);
      throw new Error(error.message || 'Failed to verify payment');
    }
  }

  static async openCheckout(options: RazorpayOptions) {
    // Load Razorpay script
    const scriptLoaded = await this.loadScript();
    if (!scriptLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Create order
    const orderData = await this.createOrder(options);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    return new Promise((resolve, reject) => {
      const rzpOptions = {
        key: this.RAZORPAY_KEY_ID,
        amount: orderData.amount * 100, // Convert to paise
        currency: orderData.currency,
        name: 'Bharat Samuh Anudan',
        description: options.type === 'installment' ? 'किस्त भुगतान' : 'दान',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            console.log('Payment successful, verifying...');
            const verificationResult = await this.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              orderData.transactionId
            );

            if (options.onSuccess) {
              options.onSuccess(verificationResult);
            }
            resolve(verificationResult);
          } catch (error) {
            console.error('Payment verification failed:', error);
            if (options.onFailure) {
              options.onFailure(error);
            }
            reject(error);
          }
        },
        prefill: {
          email: user.email,
          contact: user.user_metadata?.mobile || '',
        },
        theme: {
          color: '#1E3A8A', // Trust blue
        },
        modal: {
          ondismiss: () => {
            const error = new Error('Payment cancelled by user');
            if (options.onFailure) {
              options.onFailure(error);
            }
            reject(error);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(rzpOptions);
      razorpayInstance.open();
    });
  }
}
