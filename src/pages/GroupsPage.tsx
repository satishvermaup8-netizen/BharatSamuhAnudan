import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, X, Smartphone, Users } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { GroupCard } from '@/components/features/GroupCard';
import { JoinGroupModal } from '@/components/group';
import { mockGroups } from '@/lib/mockData';
import { ROUTES, MAX_GROUP_MEMBERS } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Group } from '@/types';

export function GroupsPage() {
  useScrollToTop();
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  // Create Group Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [mobileInput, setMobileInput] = useState('');
  const [invitedMobiles, setInvitedMobiles] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  // Ensure mockGroups is loaded and valid
  console.log('📊 Groups Page - Total groups loaded:', mockGroups?.length || 0);
  console.log('📊 Groups data:', mockGroups);

  const filteredGroups = (mockGroups || []).filter(group => {
    const matchesSearch = 
      (group.name && group.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (group.location && group.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (group.groupCode && group.groupCode.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || group.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  console.log('📊 Filtered groups:', filteredGroups?.length || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2">
            समूह खोजें
          </h1>
          <p className="text-gray-600">
            सक्रिय समुदायों से जुड़ें और बचत शुरू करें
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="समूह नाम, स्थान या कोड से खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pl-10 pr-10 appearance-none"
              >
                <option value="all">सभी स्थिति</option>
                <option value="active">सक्रिय</option>
                <option value="pending_approval">समीक्षा में</option>
                <option value="inactive">निष्क्रिय</option>
              </select>
            </div>

            {/* Create Group Button */}
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>नया समूह बनाएं</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <p className="text-gray-600 text-sm mb-1">कुल समूह</p>
            <p className="text-3xl font-bold text-gray-900">{mockGroups.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <p className="text-gray-600 text-sm mb-1">सक्रिय समूह</p>
            <p className="text-3xl font-bold text-green-600">
              {mockGroups.filter(g => g.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <p className="text-gray-600 text-sm mb-1">कुल सदस्य</p>
            <p className="text-3xl font-bold text-trust">
              {mockGroups.reduce((sum, g) => sum + g.memberCount, 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGroups.map(group => (
            <GroupCard 
              key={group.id} 
              group={group} 
              onJoin={(g) => {
                setSelectedGroup(g);
                setShowJoinModal(true);
              }}
            />
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              कोई समूह नहीं मिला
            </h3>
            <p className="text-gray-600 mb-6">
              अपनी खोज को समायोजित करें या एक नया समूह बनाएं
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>नया समूह बनाएं</span>
            </button>
          </div>
        )}

        {/* Join Group Modal */}
        {selectedGroup && (
          <JoinGroupModal
            isOpen={showJoinModal}
            onClose={() => {
              setShowJoinModal(false);
              setSelectedGroup(null);
            }}
            groupId={selectedGroup.id}
            groupName={selectedGroup.name}
            groupCode={selectedGroup.groupCode}
            memberCount={selectedGroup.memberCount}
            maxMembers={MAX_GROUP_MEMBERS}
            onJoinSuccess={() => {
              setShowJoinModal(false);
              setSelectedGroup(null);
              // Refresh groups list
              navigate(ROUTES.DASHBOARD);
            }}
          />
        )}

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">नया समूह बनाएं</h2>
                  <p className="text-gray-600 text-sm">अपना बचत समूह शुरू करें</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Group Name Input */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    समूह का नाम *
                  </Label>
                  <Input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="उदाहरण: स्वाभिमान समूह"
                    className="w-full"
                  />
                </div>

                {/* Live Preview Card */}
                {groupName && (
                  <div className="bg-gradient-to-br from-trust-light to-trust rounded-xl p-4 text-white shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{groupName}</h3>
                        <p className="text-sm text-white/80">नया समूह</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/80 pt-3 border-t border-white/20">
                      <span>सदस्य: {invitedMobiles.length + 1} (आप + {invitedMobiles.length} आमंत्रित)</span>
                    </div>
                  </div>
                )}

                {/* Mobile Invitation Section */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>सदस्यों को आमंत्रित करें (वैकल्पिक)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      placeholder="10 अंकों का मोबाइल नंबर"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          if (mobileInput && /^\d{10}$/.test(mobileInput) && !invitedMobiles.includes(mobileInput)) {
                            setInvitedMobiles([...invitedMobiles, mobileInput]);
                            setMobileInput('');
                          }
                        }
                      }}
                      maxLength={10}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (mobileInput && /^\d{10}$/.test(mobileInput) && !invitedMobiles.includes(mobileInput)) {
                          setInvitedMobiles([...invitedMobiles, mobileInput]);
                          setMobileInput('');
                        }
                      }}
                      disabled={!mobileInput || !/^\d{10}$/.test(mobileInput)}
                    >
                      जोड़ें
                    </Button>
                  </div>
                  
                  {/* Invited Mobiles List */}
                  {invitedMobiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600">आमंत्रित मोबाइल नंबर:</p>
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
                </div>

                {/* Info Text */}
                <p className="text-xs text-gray-500">
                  समूह बनाने के बाद आप अधिक सदस्यों को आमंत्रित कर सकते हैं।
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-3 p-6 border-t bg-gray-50">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  रद्द करें
                </Button>
                <Button
                  onClick={async () => {
                    if (!groupName.trim()) return;
                    
                    setCreating(true);
                    try {
                      // Simulate API call
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      // Close modal and refresh
                      setShowCreateModal(false);
                      setGroupName('');
                      setInvitedMobiles([]);
                      
                      // Show success or redirect
                      alert(`समूह "${groupName}" सफलतापूर्वक बनाया गया!`);
                    } catch (error) {
                      console.error('Failed to create group:', error);
                    } finally {
                      setCreating(false);
                    }
                  }}
                  disabled={!groupName.trim() || creating}
                  className="flex-1 bg-trust hover:bg-trust-dark"
                >
                  {creating ? 'बनाया जा रहा है...' : 'समूह बनाएं'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}