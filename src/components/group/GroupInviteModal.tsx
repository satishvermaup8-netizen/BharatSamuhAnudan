import { useState } from 'react';
import { X, Copy, Share2, Mail, MessageCircle, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface GroupInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  groupCode: string;
}

export function GroupInviteModal({ isOpen, onClose, groupId, groupName, groupCode }: GroupInviteModalProps) {
  const { toast } = useToast();
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [invitedPhones, setInvitedPhones] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'link' | 'email' | 'whatsapp'>('link');

  const inviteLink = `${window.location.origin}/groups/join/${groupCode}`;
  const maxMembers = 1000;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: 'लिंक कॉपी हो गया!',
      description: 'आमंत्रण लिंक क्लिपबोर्ड पर कॉपी हो गया है।',
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `${groupName} में शामिल हों`,
      text: `${groupName} समूह में शामिल हों। कोड: ${groupCode}`,
      url: inviteLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleAddEmail = () => {
    if (emailInput && !invitedEmails.includes(emailInput)) {
      setInvitedEmails([...invitedEmails, emailInput]);
      setEmailInput('');
      toast({
        title: 'ईमेल जोड़ा गया',
        description: `${emailInput} को आमंत्रण भेजा जाएगा।`,
      });
    }
  };

  const handleAddPhone = () => {
    if (phoneInput && !invitedPhones.includes(phoneInput)) {
      setInvitedPhones([...invitedPhones, phoneInput]);
      setPhoneInput('');
      toast({
        title: 'फोन नंबर जोड़ा गया',
        description: `${phoneInput} पर WhatsApp आमंत्रण भेजा जाएगा।`,
      });
    }
  };

  const handleSendInvites = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'आमंत्रण भेजे गए!',
      description: `${invitedEmails.length + invitedPhones.length} सदस्यों को आमंत्रण भेजा गया।`,
    });
    
    setInvitedEmails([]);
    setInvitedPhones([]);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-trust" />
            सदस्यों को आमंत्रित करें
          </DialogTitle>
          <DialogDescription>
            "{groupName}" में सदस्यों को जोड़ें। अधिकतम {maxMembers} सदस्य।
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">समूह सफलतापूर्वक बनाया गया!</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            अब अपने समुदाय के सदस्यों को आमंत्रित करें।
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-4">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'link' ? 'bg-white text-trust shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Share2 className="w-4 h-4" />
            लिंक साझा करें
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'email' ? 'bg-white text-trust shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            ईमेल
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'whatsapp' ? 'bg-white text-trust shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>

        {/* Link Tab */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                आमंत्रण लिंक
              </Label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-white"
                />
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  कॉपी
                </Button>
              </div>
            </div>
            <Button onClick={handleShare} className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              साझा करें
            </Button>
          </div>
        )}

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="ईमेल पता दर्ज करें"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
              />
              <Button onClick={handleAddEmail} variant="outline">
                जोड़ें
              </Button>
            </div>
            {invitedEmails.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">आमंत्रित ईमेल:</Label>
                <div className="flex flex-wrap gap-2">
                  {invitedEmails.map((email, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {email}
                      <button
                        onClick={() => setInvitedEmails(invitedEmails.filter((_, i) => i !== index))}
                        className="ml-2 hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {invitedEmails.length > 0 && (
              <Button onClick={handleSendInvites} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                {invitedEmails.length} ईमेल भेजें
              </Button>
            )}
          </div>
        )}

        {/* WhatsApp Tab */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="फोन नंबर दर्ज करें"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPhone()}
              />
              <Button onClick={handleAddPhone} variant="outline">
                जोड़ें
              </Button>
            </div>
            {invitedPhones.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">आमंत्रित फोन:</Label>
                <div className="flex flex-wrap gap-2">
                  {invitedPhones.map((phone, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {phone}
                      <button
                        onClick={() => setInvitedPhones(invitedPhones.filter((_, i) => i !== index))}
                        className="ml-2 hover:text-green-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {invitedPhones.length > 0 && (
              <Button onClick={handleSendInvites} className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                {invitedPhones.length} WhatsApp भेजें
              </Button>
            )}
          </div>
        )}

        {/* Skip Button */}
        <div className="mt-4 pt-4 border-t">
          <Button variant="ghost" onClick={handleSkip} className="w-full text-gray-500">
            बाद में करें
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
