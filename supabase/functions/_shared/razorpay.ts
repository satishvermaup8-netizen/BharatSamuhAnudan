import { createHmac } from 'node:crypto';

export interface RazorpayOrderOptions {
  amount: number; // in paise (100 paise = 1 INR)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export class RazorpayClient {
  private keyId: string;
  private keySecret: string;
  private baseUrl = 'https://api.razorpay.com/v1';

  constructor(keyId: string, keySecret: string) {
    this.keyId = keyId;
    this.keySecret = keySecret;
  }

  private getAuthHeader(): string {
    const credentials = btoa(`${this.keyId}:${this.keySecret}`);
    return `Basic ${credentials}`;
  }

  async createOrder(options: RazorpayOrderOptions): Promise<RazorpayOrder> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt,
        notes: options.notes,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Razorpay: ${error.error?.description || 'Failed to create order'}`);
    }

    return await response.json();
  }

  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    const text = `${orderId}|${paymentId}`;
    const generated = createHmac('sha256', this.keySecret)
      .update(text)
      .digest('hex');
    
    return generated === signature;
  }

  async fetchPayment(paymentId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Razorpay: ${error.error?.description || 'Failed to fetch payment'}`);
    }

    return await response.json();
  }
}
