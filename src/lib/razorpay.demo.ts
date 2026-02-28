// Demo Razorpay Service - for development/testing without actual API integration

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
  /**
   * Demo mode payment processing
   * Simulates successful payment without actual API calls
   */
  static async openCheckout(options: RazorpayOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulate payment processing with delay
      const processingTime = Math.random() * 1000 + 1000; // 1-2 seconds
      
      const timeoutId = setTimeout(() => {
        try {
          // Generate mock successful response
          const mockResponse = {
            success: true,
            razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            razorpay_order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            razorpay_signature: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
          console.error('Demo payment processing error:', error);
          if (options.onFailure) {
            options.onFailure(error);
          }
          reject(error);
        }
      }, processingTime);
    });
  }

  /**
   * Mock order creation
   */
  static async createOrder(options: RazorpayOptions) {
    return {
      orderId: `order_${Date.now()}`,
      amount: options.amount,
      currency: 'INR',
      transactionId: `txn_${Date.now()}`,
    };
  }

  /**
   * Mock payment verification
   */
  static async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string,
    transactionId: string
  ) {
    return {
      verified: true,
      orderId,
      paymentId,
      signature,
      transactionId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Load Razorpay script (not used in demo mode but kept for compatibility)
   */
  static loadScript(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
