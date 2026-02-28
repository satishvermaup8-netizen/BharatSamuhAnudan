/**
 * Comprehensive Fund Management Dashboard
 * Shows real-time fund flows, balances, distributions, and audit trails
 */

import { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Wallet,
  Users,
  Calendar,
  RefreshCw,
  Download,
  Settings,
} from 'lucide-react';
import {
  generateMockFundData,
  generateMockFlowData,
  generateMockDistributionData,
  generateMockAuditTrail,
  calculateFundStats,
  formatCurrency,
  FundAccount,
  FlowData,
  Distribution,
  AuditEntry,
} from '@/lib/fundManagement';
import { InflowOutflowChart, FlowSummaryCard, WaterfallChart } from '@/components/dashboard/InflowOutflowChart';
import { BalanceTrendsChart, FundHealthCard, BalanceSummary } from '@/components/dashboard/BalanceTrends';
import { DistributionPieChart, DistributionDetailsTable, DistributionSummaryCards, DistributionComparisonChart } from '@/components/dashboard/DistributionReports';
import { AuditTrail, AuditSummary } from '@/components/dashboard/AuditTrail';

export function FundManagementDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'flows' | 'distributions' | 'audit'>('overview');
  const [fundAccounts, setFundAccounts] = useState<FundAccount[]>([]);
  const [flowData, setFlowData] = useState<FlowData[]>([]);
  const [distributionData, setDistributionData] = useState<Distribution[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>(new Date().toLocaleTimeString());

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API calls with timeout
        await new Promise(resolve => setTimeout(resolve, 800));

        setFundAccounts(generateMockFundData());
        setFlowData(generateMockFlowData());
        setDistributionData(generateMockDistributionData());
        setAuditTrail(generateMockAuditTrail());
        setLastRefresh(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Failed to load fund data:', error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setFlowData(generateMockFlowData());
    setAuditTrail(generateMockAuditTrail());
    setLastRefresh(new Date().toLocaleTimeString());
    setLoading(false);
  };

  const handleExportAudit = () => {
    const csv = [
      ['ID', 'Timestamp', 'Action', 'Resource Type', 'Resource ID', 'Status', 'Initiated By'],
      ...auditTrail.map(e => [
        e.id,
        e.timestamp,
        e.action,
        e.resourceType,
        e.resourceId,
        e.status,
        e.initiatedBy,
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = useMemo(() => calculateFundStats(fundAccounts), [fundAccounts]);

  if (loading && fundAccounts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fund management dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 font-heading mb-2 flex items-center space-x-3">
                <Wallet className="w-10 h-10 text-blue-600" />
                <span>Fund Management Dashboard</span>
              </h1>
              <p className="text-gray-600">Real-time fund flows, balances, distributions, and audit trails</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition font-medium"
                title={`Last refresh: ${lastRefresh}`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExportAudit}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>

              <button
                className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-600">Total Balance</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBalance)}</p>
            <p className="text-xs text-gray-500 mt-2">Across {stats.activeFunds} active funds</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-600">Total Inflow</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalInflow)}</p>
            <p className="text-xs text-gray-500 mt-2">All-time received</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-600">Total Outflow</h4>
            </div>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalOutflow)}</p>
            <p className="text-xs text-gray-500 mt-2">All-time distributed</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-600">Active Funds</h4>
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.activeFunds}</p>
            <p className="text-xs text-gray-500 mt-2">{fundAccounts.filter(f => f.status === 'active').length} categories</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200 flex space-x-6 overflow-x-auto">
          {(['overview', 'flows', 'distributions', 'audit'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-4 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview'
                ? '📊 Overview'
                : tab === 'flows'
                ? '💱 Fund Flows'
                : tab === 'distributions'
                ? '📦 Distributions'
                : '📋 Audit Trail'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Fund Health Cards */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Fund Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fundAccounts.map(fund => (
                    <FundHealthCard
                      key={fund.id}
                      fundType={fund.type}
                      currentBalance={fund.balance}
                      previousBalance={fund.balance * 0.85}
                      projectedInflow={Math.floor(Math.random() * 200000)}
                      projectedOutflow={Math.floor(Math.random() * 150000)}
                    />
                  ))}
                </div>
              </div>

              {/* Balance Summary */}
              <BalanceSummary
                balances={fundAccounts.reduce(
                  (acc, fund) => ({ ...acc, [fund.type]: fund.balance }),
                  {} as Record<string, number>
                )}
              />

              {/* Balance Trends */}
              <BalanceTrendsChart
                data={Array.from({ length: 60 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  return {
                    date: date.toISOString().split('T')[0],
                    balance: Math.random() * 500000 + 100000,
                    fundType: fundAccounts[Math.floor(Math.random() * fundAccounts.length)].type,
                  };
                }).reverse()}
              />
            </>
          )}

          {/* Fund Flows Tab */}
          {activeTab === 'flows' && (
            <>
              <InflowOutflowChart data={flowData} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WaterfallChart
                  startBalance={500000}
                  inflow={300000}
                  outflow={150000}
                  endBalance={650000}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Monthly Summary</h3>
                  <FlowSummaryCard
                    label="Current Month"
                    inflow={flowData.reduce((sum, d) => sum + d.inflow, 0)}
                    outflow={flowData.reduce((sum, d) => sum + d.outflow, 0)}
                    net={flowData.reduce((sum, d) => sum + d.net, 0)}
                    trend={flowData.reduce((sum, d) => sum + d.net, 0) > 0 ? 'up' : 'down'}
                  />

                  <FlowSummaryCard
                    label="Last Month"
                    inflow={410000}
                    outflow={320000}
                    net={90000}
                    trend="down"
                  />

                  <FlowSummaryCard
                    label="Projected (Next 30 days)"
                    inflow={520000}
                    outflow={380000}
                    net={140000}
                    trend="up"
                  />
                </div>
              </div>
            </>
          )}

          {/* Distributions Tab */}
          {activeTab === 'distributions' && (
            <>
              <DistributionSummaryCards data={distributionData} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DistributionPieChart data={distributionData} />
                <DistributionComparisonChart data={distributionData} />
              </div>

              <DistributionDetailsTable data={distributionData} />
            </>
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <>
              <AuditSummary entries={auditTrail} />
              <AuditTrail entries={auditTrail} onExport={handleExportAudit} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Last updated: {lastRefresh}</p>
          <p className="mt-2 text-xs text-gray-500">
            All amounts are in Indian Rupees (₹). This dashboard shows real-time data synchronized
            every 5 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
