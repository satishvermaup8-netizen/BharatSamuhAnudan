import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { GroupCard } from '@/components/features/GroupCard';
import { JoinGroupModal } from '@/components/group';
import { mockGroups } from '@/lib/mockData';
import { ROUTES, MAX_GROUP_MEMBERS } from '@/constants';
import type { Group } from '@/types';

export function GroupsPage() {
  useScrollToTop();
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

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
              onClick={() => navigate(ROUTES.CREATE_GROUP)}
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
              onClick={() => navigate(ROUTES.CREATE_GROUP)}
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
      </div>
    </div>
  );
}