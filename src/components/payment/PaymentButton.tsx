import { useState } from 'react';
import { CreditCard, Loader2, ShieldCheck, IndianRupee } from 'lucide-react';
import { RazorpayService, RazorpayOptions } from '@/lib/razorpay';
import { Button } from '@/components/ui/button';

interface PaymentButtonProps {
  amount: number;
  groupId?: string;
  type?: 'installment' | 'donation' | 'membership' | 'renewal';
  label?: string;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function PaymentButton({
  amount,
  groupId,
  type = 'installment',
  label,
  onSuccess,
  onFailure,
  disabled = false,
  className = '',
  variant = 'default',
  size = 'md',
  showIcon = true,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const getButtonText = () => {
    if (label) return label;
    switch (type) {
      case 'installment':
        return 'किस्त भुगतान करें';
      case 'donation':
        return 'दान करें';
      case 'membership':
        return 'सदस्यता लें';
      case 'renewal':
        return 'नवीनीकरण करें';
      default:
        return 'भुगतान करें';
    }
  };

  const getButtonIcon = () => {
    switch (type) {
      case 'installment':
        return '💰';
      case 'donation':
        return '❤️';
      case 'membership':
        return '👥';
      case 'renewal':
        return '🔄';
      default:
        return '💳';
    }
  };

  const getButtonStyles = () => {
    const baseStyles = 'flex items-center justify-center gap-2 font-medium rounded-lg transition-all';
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const variantStyles = {
      default: 'bg-trust hover:bg-trust-dark text-white shadow-md hover:shadow-lg',
      outline: 'border-2 border-trust text-trust hover:bg-trust-light',
      ghost: 'text-trust hover:bg-trust-light',
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await RazorpayService.openCheckout({
        amount,
        groupId,
        type,
        onSuccess: (response) => {
          setLoading(false);
          if (onSuccess) onSuccess(response);
        },
        onFailure: (error) => {
          setLoading(false);
          if (onFailure) onFailure(error);
        },
      });
    } catch (error: any) {
      setLoading(false);
      if (onFailure) {
        onFailure(error);
      } else {
        console.error('Payment error:', error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handlePayment}
        disabled={disabled || loading}
        className={getButtonStyles()}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>प्रोसेस हो रहा है...</span>
          </>
        ) : (
          <>
            {showIcon && <span>{getButtonIcon()}</span>}
            <span>{getButtonText()}</span>
            <span className="flex items-center">
              <IndianRupee className="w-4 h-4" />
              {amount.toLocaleString('hi-IN')}
            </span>
          </>
        )}
      </button>
      
      {/* Security badge */}
      <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
        <ShieldCheck className="w-3 h-3" />
        <span>Razorpay सुरक्षित भुगतान</span>
      </div>
    </div>
  );
}

export default PaymentButton;
