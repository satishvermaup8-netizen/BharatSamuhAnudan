import { useState } from 'react';
import { X, Users, IndianRupee, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RazorpayService } from '@/lib/razorpay';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { INSTALLMENT_AMOUNT } from '@/constants';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  groupCode: string;
  memberCount: number;
  maxMembers: number;
  onJoinSuccess?: () => void;
}

export function JoinGroupModal({ 
  isOpen, 
  onClose, 
  groupId, 
  groupName, 
  groupCode,
  memberCount,
  maxMembers,
  onJoinSuccess 
}: JoinGroupModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleJoin = async () => {
    if (!user) {
      toast({
        title: 'लॉगिन आवश्यक',
        description: 'समूह में शामिल होने के लिए कृपया लॉगिन करें।',
        variant: 'destructive',
      });
      return;
    }

    // Check if group is full
    if (memberCount >= maxMembers) {
      toast({
        title: 'समूह पूर्ण',
        description: 'यह समूह अधिकतम सदस्यों तक पहुँच गया है।',
        variant: 'destructive',
      });
      return;
    }

    setStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      await RazorpayService.openCheckout({
        amount: INSTALLMENT_AMOUNT,
        type: 'installment',
        groupId,
        metadata: {
          groupId,
          groupName,
          userId: user?.id,
          installmentNumber: 1,
          isFirstPayment: true,
        },
        onSuccess: async (response) => {
          // Simulate joining group after payment
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setIsProcessing(false);
          setStep('success');
          
          toast({
            title: 'भुगतान सफल!',
            description: `आप ${groupName} में सफलतापूर्वक शामिल हो गए हैं।`,
          });

          if (onJoinSuccess) {
            onJoinSuccess();
          }
        },
        onFailure: (error) => {
          setIsProcessing(false);
          toast({
            title: 'भुगतान विफल',
            description: error?.message || 'भुगतान प्रक्रिया में त्रुटि हुई। कृपया पुनः प्रयास करें।',
            variant: 'destructive',
          });
        },
      });
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: 'त्रुटि',
        description: error?.message || 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setStep('info');
    setIsProcessing(false);
    onClose();
  };

  const handleDone = () => {
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'info' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-trust" />
                {groupName} में शामिल हों
              </DialogTitle>
              <DialogDescription>
                समूह कोड: {groupCode}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Group Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">वर्तमान सदस्य</span>
                  <span className="font-medium">{memberCount} / {maxMembers}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-trust h-2 rounded-full transition-all"
                    style={{ width: `${(memberCount / maxMembers) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">खाली स्थान</span>
                  <span className="font-medium text-green-600">{maxMembers - memberCount} बचे</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">सदस्यता के लाभ:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>मासिक ₹{INSTALLMENT_AMOUNT} बचत</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>32 महीने में ₹3,200 जमा</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>आपातकालीन वित्तीय सहायता</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>लाभार्थी चयन में भागीदारी</span>
                  </li>
                </ul>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-900 font-medium">पहली किश्त</span>
                  <span className="text-2xl font-bold text-blue-900">₹{INSTALLMENT_AMOUNT}</span>
                </div>
                <p className="text-sm text-blue-700">
                  शामिल होने के लिए पहली किश्त ₹{INSTALLMENT_AMOUNT} का भुगतान आवश्यक है।
                </p>
              </div>

              <Button onClick={handleJoin} className="w-full">
                <IndianRupee className="w-4 h-4 mr-2" />
                ₹{INSTALLMENT_AMOUNT} के साथ शामिल हों
              </Button>
            </div>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-trust" />
                भुगतान करें
              </DialogTitle>
              <DialogDescription>
                {groupName} - पहली किश्त
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Payment Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">किश्त राशि</span>
                  <span className="font-medium">₹{INSTALLMENT_AMOUNT}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">प्रोसेसिंग शुल्क</span>
                  <span className="font-medium">₹0</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="font-medium">कुल राशि</span>
                  <span className="text-xl font-bold text-trust">₹{INSTALLMENT_AMOUNT}</span>
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-500" />
                <span>सुरक्षित Razorpay भुगतान</span>
              </div>

              <Button 
                onClick={handlePayment} 
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    प्रोसेसिंग...
                  </>
                ) : (
                  <>
                    <IndianRupee className="w-4 h-4 mr-2" />
                    ₹{INSTALLMENT_AMOUNT} का भुगतान करें
                  </>
                )}
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => setStep('info')} 
                className="w-full"
                disabled={isProcessing}
              >
                वापस जाएं
              </Button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                सफलतापूर्वक शामिल हुए!
              </DialogTitle>
              <DialogDescription>
                {groupName} में आपका स्वागत है
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  भुगतान सफल!
                </h3>
                <p className="text-green-700">
                  ₹{INSTALLMENT_AMOUNT} की पहली किश्त प्राप्त हुई।
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>आप अब समूह के सदस्य हैं</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>हर महीने ₹{INSTALLMENT_AMOUNT} योगदान करें</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>लाभार्थी चयन में भाग लें</span>
                </p>
              </div>

              <Button onClick={handleDone} className="w-full">
                डैशबोर्ड पर जाएं
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
