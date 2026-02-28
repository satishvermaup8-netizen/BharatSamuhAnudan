import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Wallet, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { RazorpayService } from '@/lib/razorpay';

interface AddMoneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (amount: number) => void;
}

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export function AddMoneyModal({ open, onOpenChange, onSuccess }: AddMoneyModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const selectedAmount = amount === 'custom' ? parseInt(customAmount) || 0 : parseInt(amount) || 0;

  const handlePayment = async () => {
    if (selectedAmount < 100) {
      setError('न्यूनतम राशि ₹100 होनी चाहिए');
      return;
    }

    if (selectedAmount > 100000) {
      setError('अधिकतम राशि ₹1,00,000 हो सकती है');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await RazorpayService.openCheckout({
        amount: selectedAmount,
        type: 'donation',
        onSuccess: (response) => {
          setLoading(false);
          onSuccess?.(selectedAmount);
          onOpenChange(false);
          setAmount('');
          setCustomAmount('');
        },
        onFailure: (err) => {
          setLoading(false);
          setError(err.message || 'भुगतान विफल हुआ');
        },
      });
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'भुगतान शुरू करने में विफल');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-trust" />
            वॉलेट में जोड़ें
          </DialogTitle>
          <DialogDescription>
            अपने वॉलेट में पैसे जोड़ने के लिए राशि चुनें
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quick Amount Selection */}
          <div className="grid grid-cols-3 gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setAmount(amt.toString());
                  setCustomAmount('');
                }}
                className={`py-3 px-2 rounded-lg border-2 font-medium transition-all ${
                  amount === amt.toString()
                    ? 'border-trust bg-trust-light text-trust-dark'
                    : 'border-gray-200 hover:border-trust-light'
                }`}
              >
                ₹{amt.toLocaleString('hi-IN')}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label className="text-gray-700">या कस्टम राशि दर्ज करें</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <Input
                type="number"
                placeholder="अपनी राशि दर्ज करें"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount('custom');
                }}
                className="pl-8"
                min="100"
                max="100000"
              />
            </div>
          </div>

          {/* Selected Amount Display */}
          {selectedAmount > 0 && (
            <div className="bg-trust-light rounded-lg p-4 flex items-center justify-between">
              <span className="text-gray-700">कुल राशि:</span>
              <span className="text-2xl font-bold text-trust-dark">
                ₹{selectedAmount.toLocaleString('hi-IN')}
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">सुरक्षित भुगतान</span>
            </div>
            <p className="text-xs">आपका भुगतान Razorpay के माध्यम से सुरक्षित रूप से संcessful होगा</p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            रद्द करें
          </Button>
          <Button
            onClick={handlePayment}
            disabled={selectedAmount < 100 || loading}
            className="bg-trust hover:bg-trust-dark"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                प्रोसेस हो रहा है...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                भुगतान करें
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddMoneyModal;
