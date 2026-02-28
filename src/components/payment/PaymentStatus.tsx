import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PaymentStatusProps {
  status: 'success' | 'failure' | 'pending' | 'verifying';
  amount?: number;
  transactionId?: string;
  message?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export function PaymentStatus({
  status,
  amount,
  transactionId,
  message,
  onRetry,
  onClose,
}: PaymentStatusProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === 'success' && onClose) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, onClose]);

  if (status === 'pending' || status === 'verifying') {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 pb-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {status === 'verifying' ? 'भुगतान सत्यापित हो रहा है...' : 'भुगतान प्रक्रियाधीन'}
          </h3>
          <p className="text-gray-600">
            {status === 'verifying' 
              ? 'कृपया प्रतीक्षा करें, आपका भुगतान सत्यापित किया जा रहा है।'
              : 'कृपया प्रतीक्षा करें...'}
          </p>
          {amount && (
            <p className="text-2xl font-bold text-trust mt-4">
              ₹{amount.toLocaleString('hi-IN')}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="w-full max-w-md border-green-200 bg-green-50">
        <CardContent className="pt-6 pb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            भुगतान सफल!
          </h3>
          <p className="text-green-700 mb-4">
            आपका भुगतान सफलतापूर्वक हो गया है।
          </p>
          {amount && (
            <p className="text-2xl font-bold text-green-700 mb-2">
              ₹{amount.toLocaleString('hi-IN')}
            </p>
          )}
          {transactionId && (
            <p className="text-sm text-gray-500">
              लेनदेन ID: {transactionId.slice(0, 8)}...
            </p>
          )}
          {onClose && (
            <p className="text-sm text-gray-500 mt-4">
              {countdown} सेकंड में स्वतः बंद हो जाएगा
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (status === 'failure') {
    return (
      <Card className="w-full max-w-md border-red-200 bg-red-50">
        <CardContent className="pt-6 pb-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-900 mb-2">
            भुगतान विफल
          </h3>
          <p className="text-red-700 mb-4">
            {message || 'भुगतान के दौरान कोई समस्या आई। कृपया पुनः प्रयास करें।'}
          </p>
          {amount && (
            <p className="text-lg font-medium text-gray-700 mb-4">
              राशि: ₹{amount.toLocaleString('hi-IN')}
            </p>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 px-6 py-2 bg-trust text-white rounded-lg hover:bg-trust-dark transition-colors"
            >
              पुनः प्रयास करें
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}

export default PaymentStatus;
