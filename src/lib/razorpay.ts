// Razorpay Service with Demo Mode Support

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

// Set to true for demo/testing mode, false for production with real API
const USE_DEMO_MODE = true;

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
    // Demo mode: return mock order data
    if (USE_DEMO_MODE) {
      return {
        orderId: `order_demo_${Date.now()}`,
        amount: options.amount,
        currency: 'INR',
        transactionId: `txn_demo_${Date.now()}`,
      };
    }

    // Production mode: call Supabase function
    try {
      const { supabase } = await import('./supabase');
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
    // Demo mode: return mock verification
    if (USE_DEMO_MODE) {
      return {
        verified: true,
        orderId,
        paymentId,
        signature,
        transactionId,
        timestamp: new Date().toISOString(),
      };
    }

    // Production mode: call Supabase function
    try {
      const { supabase } = await import('./supabase');
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
    // Demo mode: simulate payment
    if (USE_DEMO_MODE) {
      return new Promise((resolve, reject) => {
        // Show loading state for realistic UX (1-2 seconds)
        const processingTime = Math.random() * 1000 + 1000;
        
        setTimeout(() => {
          try {
            const mockResponse = {
              success: true,
              razorpay_payment_id: `pay_demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              razorpay_order_id: `order_demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              razorpay_signature: `sig_demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              amount: options.amount,
              type: options.type || 'installment',
              currency: 'INR',
              timestamp: new Date().toISOString(),
              metadata: options.metadata || {},
            };
            
            console.log('✅ Demo Payment Successful:', mockResponse);
            
            if (options.onSuccess) {
              options.onSuccess(mockResponse);
            }
            
            resolve(mockResponse);
          } catch (error) {
            console.error('Demo payment error:', error);
            if (options.onFailure) {
              options.onFailure(error);
            }
            reject(error);
          }
        }, processingTime);
      });
    }

    // Production mode: Use real Razorpay
    const scriptLoaded = await this.loadScript();
    if (!scriptLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Create order
    const orderData = await this.createOrder(options);

    // Get current user
    try {
      const { supabase } = await import('./supabase');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      return new Promise((resolve, reject) => {
        const rzpOptions = {
          key: this.RAZORPAY_KEY_ID,
          amount: orderData.amount * 100,
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
            email: user.email || '',
            contact: user.user_metadata?.mobile || '',
          },
          theme: {
            color: '#1E3A8A',
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
    } catch (error) {
      console.error('Production mode error:', error);
      throw error;
    }
  }
}
