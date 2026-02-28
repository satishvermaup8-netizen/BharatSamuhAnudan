/**
 * Beneficiary Rotation Dashboard
 * Complete interface for managing beneficiary selection, approval, and payment scheduling
 */

import React, { useState } from 'react';
import { RefreshCw, Users, FileText, TrendingUp } from 'lucide-react';
import {
  BeneficiaryRotationEngine,
  generateMockGroupMembers,
  generateMockRotationRound,
} from '@/lib/beneficiaryRotation';
import { SelectionCriteriaCard, CandidateComparison, EligibilitySummary } from './BeneficiarySelection';
import { ApprovalTimeline, ApprovalRequestCard, ApproverList } from './ApprovalWorkflow';
import { PaymentScheduleViewer } from './PaymentSchedule';

export interface BeneficiaryRotationDashboardProps {
  groupId: string;
  groupName: string;
  currentUserId?: string;
  currentUserRole?: 'committee' | 'treasurer' | 'admin';
  onSelectionComplete?: (selection: any) => void;
  onApprovalComplete?: (approval: any) => void;
}

type DashboardTab = 'overview' | 'selection' | 'approval' | 'payment' | 'history';

/**
 * Main Dashboard Component
 */
export function BeneficiaryRotationDashboard({
  groupId,
  groupName,
  currentUserId = 'user-001',
  currentUserRole = 'committee',
  onSelectionComplete,
  onApprovalComplete,
}: BeneficiaryRotationDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock data
  const members = generateMockGroupMembers();
  const currentRound = generateMockRotationRound();

  // Generate beneficiary selection
  const selectedMember = members[0];
  const candidates = members.map((member: any) => ({
    member,
    eligibilityScore: BeneficiaryRotationEngine.calculateEligibilityScore(
      member,
      'round_robin',
      members
    ),
    waitingPeriodMonths: Math.floor(Math.random() * 24),
    needRating: Math.floor(Math.random() * 100),
    contributionRating: Math.floor(Math.random() * 100),
    finalScore: Math.random() * 100,
  }));

  const eligibleMembers = candidates.length;
  const fairnessScore = 0.85;

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const TabButton = ({ tab, label }: { tab: DashboardTab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-semibold rounded-lg transition ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{groupName}</h1>
              <p className="text-gray-600 mt-2">Beneficiary Rotation Management</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            <TabButton tab="overview" label="🎯 Overview" />
            <TabButton tab="selection" label="👥 Selection" />
            <TabButton tab="approval" label="✅ Approval" />
            <TabButton tab="payment" label="💰 Payment" />
            <TabButton tab="history" label="📊 History" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <Users className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-sm text-gray-600 mb-2">Total Members</h3>
                <p className="text-3xl font-bold text-gray-900">{members.length}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6">
                <FileText className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-sm text-gray-600 mb-2">Current Round</h3>
                <p className="text-3xl font-bold text-gray-900">{currentRound.roundNumber}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-sm text-gray-600 mb-2">Fairness Score</h3>
                <p className="text-3xl font-bold text-gray-900">{Math.round(fairnessScore * 100)}%</p>
              </div>
              <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6">
                <TrendingUp className="w-8 h-8 text-orange-600 mb-4" />
                <h3 className="text-sm text-gray-600 mb-2">Status</h3>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  <span className="text-green-600">Active</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current Selection</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Beneficiary</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedMember.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selection Method</p>
                  <p className="text-2xl font-bold text-gray-900">Round Robin</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Eligible Members</p>
                  <p className="text-2xl font-bold text-gray-900">{eligibleMembers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="text-2xl font-bold text-green-600">Approved</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'selection' && (
          <div className="space-y-6">
            <SelectionCriteriaCard strategy="round_robin" />
            <CandidateComparison candidates={candidates} strategy="round_robin" />
            <EligibilitySummary candidates={candidates} />
          </div>
        )}

        {activeTab === 'approval' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Approval Workflow</h2>
              <p className="text-gray-600">Approval management features</p>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Schedule</h2>
            <p className="text-gray-600">Payment tracking features</p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Distribution History</h2>
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No historical distributions yet</p>
              <p className="text-sm text-gray-500">Previous distributions will be shown here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BeneficiaryRotationDashboard;
