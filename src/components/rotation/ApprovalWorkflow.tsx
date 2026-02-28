/**
 * Distribution Approval Workflow Component
 * Multi-step approval process for beneficiary distributions
 */

import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, User } from 'lucide-react';
import {
  DistributionApproval,
  ApprovalWorkflow,
} from '@/lib/beneficiaryRotation';
import { formatCurrency } from '@/lib/fundManagement';

export interface ApprovalWorkflowUIProps {
  approval: DistributionApproval;
  beneficiaryName: string;
  amount: number;
  onApprove?: (approval: DistributionApproval) => Promise<void>;
  onReject?: (approval: DistributionApproval, reason: string) => Promise<void>;
  currentUserId?: string;
  currentUserRole?: 'committee' | 'treasurer' | 'admin';
  readOnly?: boolean;
}

/**
 * Approval Status Timeline Component
 * Shows approval progress and history
 */
export function ApprovalTimeline({ approval, beneficiaryName, amount }: ApprovalWorkflowUIProps) {
  const progress = ApprovalWorkflow.getApprovalProgress(approval);
  const isExpired = ApprovalWorkflow.isExpired(approval);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribution Approval</h3>
        <p className="text-sm text-gray-600">
          {beneficiaryName} - {formatCurrency(amount)}
        </p>
      </div>

      {/* Status Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {getStatusIcon(approval.status)}
          <div>
            <p className="font-semibold text-gray-900 capitalize">{approval.status}</p>
            <p className="text-xs text-gray-500">
              {approval.status === 'approved'
                ? 'All approvals obtained'
                : approval.status === 'rejected'
                ? `Rejected: ${approval.rejectionReason}`
                : `${progress.approvalsReceived}/${progress.approvalsRequired} approvals received`}
            </p>
          </div>
        </div>
        {isExpired && approval.status === 'pending' && (
          <div className="text-right">
            <p className="text-sm font-semibold text-red-600">Expired</p>
            <p className="text-xs text-red-500">{new Date(approval.expiresAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {approval.status === 'pending' && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Approval Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progress.approvalsReceived} of {progress.approvalsRequired} approvals
          </p>
        </div>
      )}

      {/* Approval Timeline */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-700 uppercase">Approval History</p>

        {approval.approvals.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Awaiting approvals...</p>
          </div>
        ) : (
          approval.approvals.map((record, idx) => (
            <div key={idx} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{record.approverName}</p>
                    <p className="text-xs text-gray-600 capitalize">{record.approverRole}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(record.timestamp).toLocaleString()}
                  </p>
                </div>
                {record.comments && (
                  <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                    {record.comments}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * Approval Request Card Component
 * Allows reviewing and approving/rejecting requests
 */
export function ApprovalRequestCard({
  approval,
  beneficiaryName,
  amount,
  onApprove,
  onReject,
  currentUserId,
  currentUserRole = 'committee',
  readOnly = false,
}: ApprovalWorkflowUIProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Check if user already approved
  const userAlreadyApproved = approval.approvals.some(a => a.approverId === currentUserId);
  const canApprove = !readOnly && !userAlreadyApproved && approval.status === 'pending' && currentUserId;

  const handleApprove = async () => {
    if (!onApprove) return;
    setIsApproving(true);
    try {
      const updatedApproval = ApprovalWorkflow.addApproval(
        approval,
        currentUserId || 'anonymous',
        'Current User',
        currentUserRole,
        'approved'
      );
      await onApprove(updatedApproval);
    } catch (error) {
      console.error('Approval failed:', error);
    }
    setIsApproving(false);
  };

  const handleReject = async () => {
    if (!onReject || !rejectReason.trim()) return;
    setIsRejecting(true);
    try {
      const updatedApproval = ApprovalWorkflow.addApproval(
        approval,
        currentUserId || 'anonymous',
        'Current User',
        currentUserRole,
        'rejected',
        rejectReason
      );
      await onReject(updatedApproval, rejectReason);
    } catch (error) {
      console.error('Rejection failed:', error);
    }
    setIsRejecting(false);
    setShowRejectForm(false);
  };

  if (approval.status !== 'pending') {
    return null; // Only show for pending approvals
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border-2 border-blue-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span>Pending Your Approval</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {beneficiaryName} - {formatCurrency(amount)}
          </p>
        </div>
        <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
          Requires Action
        </span>
      </div>

      {/* Request Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Approval ID</span>
          <span className="font-mono text-gray-900">{approval.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Amount</span>
          <span className="font-semibold text-gray-900">{formatCurrency(amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Expires</span>
          <span className="text-gray-900">{new Date(approval.expiresAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      {!showRejectForm ? (
        <div className="flex space-x-3">
          <button
            onClick={handleApprove}
            disabled={isApproving || !canApprove || userAlreadyApproved}
            className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{userAlreadyApproved ? 'Already Approved' : 'Approve'}</span>
          </button>

          <button
            onClick={() => setShowRejectForm(true)}
            disabled={!canApprove || userAlreadyApproved}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
          >
            <XCircle className="w-5 h-5" />
            <span>Reject</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Rejection Reason<span className="text-red-500">*</span>
          </label>
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Explain why you are rejecting this approval..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleReject}
              disabled={isRejecting || !rejectReason.trim()}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
            >
              {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
            <button
              onClick={() => {
                setShowRejectForm(false);
                setRejectReason('');
              }}
              className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {userAlreadyApproved && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>You have already approved this request</span>
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Approver List Component
 * Shows who needs to approve and who has approved
 */
export function ApproverList({ approval }: { approval: DistributionApproval }) {
  const progress = ApprovalWorkflow.getApprovalProgress(approval);
  const remainingApprovals = approval.requiredApprovals - approval.approvals.length;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Approvers</h3>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-xs font-semibold text-blue-700">
            {approval.approvals.length}/{approval.requiredApprovals}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Approved */}
        {approval.approvals.map((record, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{record.approverName}</p>
              <p className="text-xs text-gray-600 capitalize">{record.approverRole}</p>
              <p className="text-xs text-gray-500 mt-1">
                Approved on {new Date(record.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}

        {/* Pending */}
        {remainingApprovals > 0 && (
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Clock className="w-5 h-5 text-gray-400 mr-2" />
            <p className="text-sm text-gray-600">
              Awaiting {remainingApprovals} more approval{remainingApprovals > 1 ? 's' : ''}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
