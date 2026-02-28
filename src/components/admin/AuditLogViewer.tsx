import { Activity, User, Calendar, FileText } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface AuditLogViewerProps {
  logs: any[];
}

export function AuditLogViewer({ logs }: AuditLogViewerProps) {
  const getActionColor = (action: string) => {
    if (action.includes('create') || action.includes('approve')) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    if (action.includes('update') || action.includes('edit')) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (action.includes('delete') || action.includes('reject')) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('create')) return '➕';
    if (action.includes('update')) return '✏️';
    if (action.includes('delete')) return '🗑️';
    if (action.includes('approve')) return '✅';
    if (action.includes('reject')) return '❌';
    return '📝';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 font-heading flex items-center space-x-3">
          <Activity className="w-7 h-7 text-trust" />
          <span>ऑडिट लॉग</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">सभी प्रशासनिक कार्यों का रिकॉर्ड</p>
      </div>

      <div className="divide-y divide-gray-200">
        {logs.map((log, index) => (
          <div key={log.id || index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-trust text-white flex items-center justify-center text-lg">
                  {getActionIcon(log.action)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {log.action}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getActionColor(log.action)}`}>
                    {log.entity_type || 'System'}
                  </span>
                </div>

                {/* User Info */}
                {log.user_id && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4" />
                    <span>User ID: {log.user_id.slice(0, 8)}</span>
                  </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(log.created_at)}</span>
                </div>

                {/* IP and User Agent */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                  {log.ip_address && (
                    <span className="flex items-center space-x-1">
                      <span className="font-semibold">IP:</span>
                      <span className="font-mono">{log.ip_address}</span>
                    </span>
                  )}
                  {log.user_agent && (
                    <span className="flex items-center space-x-1">
                      <span className="font-semibold">Device:</span>
                      <span className="truncate max-w-xs">{log.user_agent}</span>
                    </span>
                  )}
                </div>

                {/* Data Changes */}
                {(log.old_data || log.new_data) && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-trust hover:text-trust-dark">
                      डेटा परिवर्तन देखें
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      {log.old_data && (
                        <div className="mb-2">
                          <p className="text-xs font-semibold text-gray-600 mb-1">पुराना डेटा:</p>
                          <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                            {JSON.stringify(log.old_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.new_data && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">नया डेटा:</p>
                          <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                            {JSON.stringify(log.new_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">कोई ऑडिट लॉग उपलब्ध नहीं</p>
          </div>
        )}
      </div>
    </div>
  );
}
