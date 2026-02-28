import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { RazorpayService } from '@/lib/razorpay';

interface PaymentButtonProps {
  amount: number;
  groupId?: string;
  type?: 'installment' | 'donation' | 'membership' | 'renewal';
  label?: string;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
  disabled?: boolean;
  className?: string;
}

export function PaymentButton({
  amount,
  groupId,
  type = 'installment',
  label = 'भुगतान करें',
  onSuccess,
  onFailure,
  disabled = false,
  className = '',
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await RazorpayService.openCheckout({
        amount,
        groupId,
        type,
        onSuccess: (response) => {
          setLoading(false);
          alert('भुगतान सफल! राशि आपके वॉलेट में जोड़ दी गई है।');
          if (onSuccess) onSuccess(response);
        },
        onFailure: (error) => {
          setLoading(false);
          alert(`भुगतान विफल: ${error.message}`);
          if (onFailure) onFailure(error);
        },
      });
    } catch (error: any) {
      setLoading(false);
      alert(`भुगतान शुरू करने में विफल: ${error.message}`);
      if (onFailure) onFailure(error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={`btn-primary flex items-center justify-center space-x-2 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>प्रोसेस हो रहा है...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          <span>{label} (₹{amount})</span>
        </>
      )}
    </button>
  );
}
