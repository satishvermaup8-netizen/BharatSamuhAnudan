import { useEffect, useState } from 'react';
import { Activity, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';

export function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, actionFilter, entityFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    }
    setLoading(false);
  };

  const filterLogs = () => {
    let filtered = logs;

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action.toLowerCase().includes(actionFilter));
    }

    if (entityFilter !== 'all') {
      filtered = filtered.filter(log => log.entity_type === entityFilter);
    }

    setFilteredLogs(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2 flex items-center space-x-3">
            <Activity className="w-10 h-10 text-purple-600" />
            <span>ऑडिट लॉग</span>
          </h1>
          <p className="text-gray-600">सभी प्रशासनिक और प्रणाली गतिविधियों का रिकॉर्ड</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">फ़िल्टर</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">सभी क्रियाएं</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
            </select>

            {/* Entity Filter */}
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="all">सभी इकाइयाँ</option>
              <option value="user">User</option>
              <option value="group">Group</option>
              <option value="transaction">Transaction</option>
              <option value="claim">Claim</option>
              <option value="approval">Approval</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            प्रदर्शित: <span className="font-semibold">{filteredLogs.length}</span> लॉग एंट्रीज
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">लोड हो रहा है...</p>
          </div>
        ) : (
          <AuditLogViewer logs={filteredLogs} />
        )}
      </div>
    </div>
  );
}
