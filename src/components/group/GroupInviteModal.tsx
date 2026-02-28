import { useState } from 'react';
import { X, Copy, Share2, Mail, MessageCircle, CheckCircle, Users, Smartphone, UserCircle } from 'lucide-react';
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
  const [mobileInput, setMobileInput] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [invitedPhones, setInvitedPhones] = useState<string[]>([]);
  const [invitedMobiles, setInvitedMobiles] = useState<string[]>([]);
  const [invitedUserIds, setInvitedUserIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'link' | 'email' | 'whatsapp' | 'existing'>('link');
  const [existingInviteMethod, setExistingInviteMethod] = useState<'mobile' | 'userId'>('mobile');

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

  const handleAddMobile = () => {
    if (mobileInput && !invitedMobiles.includes(mobileInput)) {
      // Validate 10 digit mobile number
      if (!/^\d{10}$/.test(mobileInput)) {
        toast({
          title: 'त्रुटि',
          description: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें',
          variant: 'destructive',
        });
        return;
      }
      setInvitedMobiles([...invitedMobiles, mobileInput]);
      setMobileInput('');
      toast({
        title: 'मोबाइल नंबर जोड़ा गया',
        description: `${mobileInput} को आमंत्रण भेजा जाएगा।`,
      });
    }
  };

  const handleAddUserId = () => {
    if (userIdInput && !invitedUserIds.includes(userIdInput)) {
      setInvitedUserIds([...invitedUserIds, userIdInput]);
      setUserIdInput('');
      toast({
        title: 'यूजर ID जोड़ा गया',
        description: `यूजर ID ${userIdInput} को आमंत्रण भेजा जाएगा।`,
      });
    }
  };

  const handleSendInvites = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const totalInvited = invitedEmails.length + invitedPhones.length + invitedMobiles.length + invitedUserIds.length;
    
    toast({
      title: 'आमंत्रण भेजे गए!',
      description: `${totalInvited} सदस्यों को आमंत्रण भेजा गया।`,
    });
    
    setInvitedEmails([]);
    setInvitedPhones([]);
    setInvitedMobiles([]);
    setInvitedUserIds([]);
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

        {/* Live Group Preview Card */}
        <div className="bg-gradient-to-br from-trust-light to-trust rounded-xl p-4 mb-4 text-white shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">{groupName}</h3>
              <p className="text-sm text-white/80">कोड: {groupCode}</p>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
              <div className="text-2xl font-bold">{invitedEmails.length + invitedPhones.length + invitedMobiles.length + invitedUserIds.length}</div>
              <div className="text-xs text-white/80">आमंत्रित</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-sm">
            <span className="text-white/80">कुल सदस्य: {invitedEmails.length + invitedPhones.length + invitedMobiles.length + invitedUserIds.length + 1} (आप + आमंत्रित)</span>
            <span className="text-white/80">अधिकतम: {maxMembers}</span>
          </div>
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
          <button
            onClick={() => setActiveTab('existing')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'existing' ? 'bg-white text-trust shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserCircle className="w-4 h-4" />
            मौजूदा उपयोगकर्ता
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

        {/* Existing Users Tab */}
        {activeTab === 'existing' && (
          <div className="space-y-4">
            {/* Method Selection */}
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setExistingInviteMethod('mobile')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  existingInviteMethod === 'mobile' ? 'bg-white text-trust shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                मोबाइल नंबर
              </button>
              <button
                onClick={() => setExistingInviteMethod('userId')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  existingInviteMethod === 'userId' ? 'bg-white text-trust shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserCircle className="w-4 h-4" />
                यूजर ID
              </button>
            </div>

            {/* Mobile Number Input */}
            {existingInviteMethod === 'mobile' && (
              <>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="10 अंकों का मोबाइल नंबर दर्ज करें"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMobile()}
                    maxLength={10}
                  />
                  <Button onClick={handleAddMobile} variant="outline">
                    जोड़ें
                  </Button>
                </div>
                {invitedMobiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">आमंत्रित मोबाइल:</Label>
                    <div className="flex flex-wrap gap-2">
                      {invitedMobiles.map((mobile, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                        >
                          {mobile}
                          <button
                            onClick={() => setInvitedMobiles(invitedMobiles.filter((_, i) => i !== index))}
                            className="ml-2 hover:text-purple-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* User ID Input */}
            {existingInviteMethod === 'userId' && (
              <>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="यूजर ID दर्ज करें"
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddUserId()}
                  />
                  <Button onClick={handleAddUserId} variant="outline">
                    जोड़ें
                  </Button>
                </div>
                {invitedUserIds.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">आमंत्रित यूजर ID:</Label>
                    <div className="flex flex-wrap gap-2">
                      {invitedUserIds.map((userId, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                        >
                          {userId}
                          <button
                            onClick={() => setInvitedUserIds(invitedUserIds.filter((_, i) => i !== index))}
                            className="ml-2 hover:text-orange-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Send Button */}
            {(invitedMobiles.length > 0 || invitedUserIds.length > 0) && (
              <Button onClick={handleSendInvites} className="w-full bg-purple-600 hover:bg-purple-700">
                <UserCircle className="w-4 h-4 mr-2" />
                {invitedMobiles.length + invitedUserIds.length} आमंत्रण भेजें
              </Button>
            )}

            <p className="text-xs text-gray-500">
              मौजूदा उपयोगकर्ताओं को सीधे उनके मोबाइल नंबर या यूजर ID से आमंत्रित करें। उन्हें एक नोटिफिकेशन भेजा जाएगा।
            </p>
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
