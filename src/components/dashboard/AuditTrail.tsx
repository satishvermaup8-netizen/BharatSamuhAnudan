/**
 * Transparent Audit Trail Component
 * Comprehensive logging of all fund management actions
 */

import React, { useState, useMemo } from 'react';
import { AuditEntry, formatTransactionDate } from '@/lib/fundManagement';
import { Search, Download, Filter, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export interface AuditTrailProps {
  entries: AuditEntry[];
  onExport?: () => void;
}

/**
 * Audit Trail Timeline Component
 * Shows chronological audit log with filtering and search
 */
export function AuditTrail({ entries, onExport }: AuditTrailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failure'>('all');
  const [filterResourceType, setFilterResourceType] = useState<'all' | AuditEntry['resourceType']>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let result = entries.filter(entry => {
      // Search filter
      const matchesSearch =
        entry.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.resourceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.initiatedBy?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;

      // Resource type filter
      const matchesResourceType = filterResourceType === 'all' || entry.resourceType === filterResourceType;

      return matchesSearch && matchesStatus && matchesResourceType;
    });

    // Sort
    result.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [entries, searchTerm, filterStatus, filterResourceType, sortOrder]);

  const getStatusIcon = (status: string) => {
    if (status === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getResourceTypeColor = (resourceType: string): string => {
    const colors: Record<string, string> = {
      transaction: 'bg-blue-100 text-blue-800',
      fund: 'bg-purple-100 text-purple-800',
      user: 'bg-green-100 text-green-800',
      report: 'bg-orange-100 text-orange-800',
    };
    return colors[resourceType] || 'bg-gray-100 text-gray-800';
  };

  const getActionColor = (action: string): string => {
    if (action.includes('Inflow')) return 'text-blue-600';
    if (action.includes('Outflow')) return 'text-red-600';
    if (action.includes('Transfer')) return 'text-purple-600';
    if (action.includes('Adjustment')) return 'text-yellow-600';
    if (action.includes('Generated')) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Log</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by action, resource ID, or user..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center space-x-1">
              <Filter className="w-4 h-4" />
              <span>Status</span>
            </label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All</option>
              <option value="success">Success Only</option>
              <option value="failure">Failure Only</option>
            </select>
          </div>

          {/* Resource Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Resource Type</label>
            <select
              value={filterResourceType}
              onChange={e => setFilterResourceType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All</option>
              <option value="transaction">Transaction</option>
              <option value="fund">Fund</option>
              <option value="user">User</option>
              <option value="report">Report</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Sort</label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-500 mt-4">
          Showing {filteredEntries.length} of {entries.length} entries
        </p>
      </div>

      {/* Audit Entries List */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No audit entries found</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <button
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="w-full p-4 flex items-start justify-between hover:bg-gray-50 transition"
              >
                {/* Main Row */}
                <div className="flex-1 flex items-start space-x-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(entry.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className={`font-semibold ${getActionColor(entry.action)}`}>
                        {entry.action}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getResourceTypeColor(
                          entry.resourceType
                        )}`}
                      >
                        {entry.resourceType}
                      </span>
                      {entry.status === 'failure' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold">
                          Failed
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-700">
                      Resource: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{entry.resourceId}</span>
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      By {entry.initiatedBy} • {formatTransactionDate(entry.timestamp)}
                      {entry.ipAddress && ` • IP: ${entry.ipAddress}`}
                    </p>
                  </div>
                </div>

                {/* Expand Indicator */}
                <div className="flex-shrink-0 ml-4">
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === entry.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === entry.id && (
                <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-3">
                  {entry.details && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Details</p>
                      <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                        {entry.details}
                      </p>
                    </div>
                  )}

                  {entry.oldValue && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Old Value</p>
                      <pre className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200 overflow-auto max-h-32">
                        {JSON.stringify(entry.oldValue, null, 2)}
                      </pre>
                    </div>
                  )}

                  {entry.newValue && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">New Value</p>
                      <pre className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200 overflow-auto max-h-32">
                        {JSON.stringify(entry.newValue, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-300">
                    <div>
                      <p className="text-xs text-gray-600">Timestamp</p>
                      <p className="text-sm font-mono text-gray-900">{entry.timestamp}</p>
                    </div>
                    {entry.ipAddress && (
                      <div>
                        <p className="text-xs text-gray-600">IP Address</p>
                        <p className="text-sm font-mono text-gray-900">{entry.ipAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Audit Summary Statistics Component
 */
export interface AuditSummaryProps {
  entries: AuditEntry[];
}

export function AuditSummary({ entries }: AuditSummaryProps) {
  const stats = useMemo(() => {
    const successCount = entries.filter(e => e.status === 'success').length;
    const failureCount = entries.filter(e => e.status === 'failure').length;
    const transactionCount = entries.filter(e => e.resourceType === 'transaction').length;
    const userCount = new Set(entries.map(e => e.initiatedBy)).size;

    return { successCount, failureCount, transactionCount, userCount };
  }, [entries]);

  const successRate = entries.length === 0 ? 0 : (stats.successCount / entries.length) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-600 mb-2">Total Actions</p>
        <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-600 mb-2">Success Rate</p>
        <p className="text-2xl font-bold text-green-600">{successRate.toFixed(1)}%</p>
        <p className="text-xs text-gray-500 mt-1">{stats.successCount} successful</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-600 mb-2">Transactions</p>
        <p className="text-2xl font-bold text-blue-600">{stats.transactionCount}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-600 mb-2">Active Users</p>
        <p className="text-2xl font-bold text-purple-600">{stats.userCount}</p>
      </div>
    </div>
  );
}
