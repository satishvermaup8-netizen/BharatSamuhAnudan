import { Link } from 'react-router-dom';
import { Users, MapPin, TrendingUp, Share2, UserPlus } from 'lucide-react';
import { Group } from '@/types';
import { formatCurrency, calculateProgress, getStatusColor } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { useToast } from '@/hooks/use-toast';

interface GroupCardProps {
  group: Group;
  onJoin?: (group: Group) => void;
}

export function GroupCard({ group, onJoin }: GroupCardProps) {
  const progress = calculateProgress(group.memberCount, group.maxMembers);
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: `${group.name} - भारत समूह अनुदान`,
      text: `${group.name} में शामिल हों। कोड: ${group.groupCode}. स्थान: ${group.location}`,
      url: `${window.location.origin}/groups/${group.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      toast({
        title: 'लिंक कॉपी हो गया!',
        description: 'समूह लिंक क्लिपबोर्ड पर कॉपी हो गया है।',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:-translate-y-1">
      {/* Group Photo */}
      <div className="relative h-48 overflow-hidden">
        {group.photo ? (
          <img
            src={group.photo}
            alt={group.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-trust-light to-trust flex items-center justify-center">
            <Users className="w-16 h-16 text-white/50" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(group.status)}`}>
            {group.status === 'active' ? 'सक्रिय' : group.status === 'pending_approval' ? 'समीक्षा में' : 'निष्क्रिय'}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Group Name & Code */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 font-heading">
            {group.name}
          </h3>
          <p className="text-sm text-gray-500 font-mono">
            कोड: {group.groupCode}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {group.description}
        </p>

        {/* Location & Leader */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{group.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <span>नेता: {group.leaderName}</span>
          </div>
        </div>

        {/* Member Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              सदस्य: {group.memberCount}/{group.maxMembers}
            </span>
            <span className="text-sm font-semibold text-trust">
              {progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-trust to-trust-light rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Total Fund */}
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">कुल फंड</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-green-700">
                {formatCurrency(group.totalFund)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`${ROUTES.GROUPS}/${group.id}`}
            className="flex-1 bg-trust hover:bg-trust-dark text-white font-semibold py-2.5 rounded-lg transition-all duration-200 text-center shadow-md hover:shadow-lg"
          >
            विवरण देखें
          </Link>
          <button
            onClick={handleShare}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {onJoin && (
            <button
              onClick={() => onJoin(group)}
              className="px-4 py-2.5 bg-saffron hover:bg-saffron-dark text-white rounded-lg transition-all duration-200"
              title="शामिल हों"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}