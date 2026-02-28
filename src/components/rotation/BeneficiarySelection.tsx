/**
 * Beneficiary Selection and Fair Algorithm UI Component
 * Displays selection candidates and calculation methodology
 */

import React, { useMemo } from 'react';
import { Users, TrendingUp, Clock, Award, AlertCircle } from 'lucide-react';
import {
  GroupMember,
  SelectionCandidate,
  RotationStrategy,
  BeneficiaryRotationEngine,
} from '@/lib/beneficiaryRotation';
import { formatCurrency } from '@/lib/fundManagement';

export interface BeneficiarySelectionUIProps {
  candidates: SelectionCandidate[];
  selectedBeneficiary?: GroupMember;
  strategy: RotationStrategy;
  onSelect?: (beneficiary: GroupMember) => void;
}

/**
 * Beneficiary Selection Criteria Card
 * Shows how score is calculated
 */
export function SelectionCriteriaCard({ strategy }: { strategy: RotationStrategy }) {
  const criteriaMap: Record<RotationStrategy, { title: string; factors: string[] }> = {
    round_robin: {
      title: 'Round Robin (Fair Rotation)',
      factors: [
        'Never received payments (highest priority)',
        'Time waiting since last payment',
        'Number of installments completed',
      ],
    },
    contribution_based: {
      title: 'Contribution Based',
      factors: [
        'Total contributions made',
        'Contribution relative to group average',
        'Number of times already received (lower is better)',
      ],
    },
    need_based: {
      title: 'Need Based',
      factors: [
        'Member need score (0-100)',
        'Comparison to group average need',
        'Times received (lower is better for high-need members)',
      ],
    },
    lottery: {
      title: 'Random Lottery',
      factors: [
        'Equal probability for all eligible members',
        'No bias based on contributions or need',
        'Completely random selection',
      ],
    },
  };

  const criteria = criteriaMap[strategy];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Award className="w-5 h-5 text-blue-600" />
        <span>{criteria.title}</span>
      </h3>

      <div className="space-y-3">
        <p className="text-sm text-gray-600 mb-4">Selection criteria applied:</p>
        {criteria.factors.map((factor, idx) => (
          <div key={idx} className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
            </div>
            <p className="text-sm text-gray-700">{factor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Selection Candidate Comparison Component
 * Shows scored candidates in ranking order
 */
export function CandidateComparison({ candidates, selectedBeneficiary }: BeneficiarySelectionUIProps) {
  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => b.finalScore - a.finalScore);
  }, [candidates]);

  const maxScore = sortedCandidates[0]?.finalScore || 100;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Users className="w-5 h-5 text-green-600" />
          <span>Candidate Evaluation</span>
        </h3>
        <p className="text-sm text-gray-600 mt-1">Selected based on fair selection algorithm</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Beneficiary</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Waiting (mo)</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Times Received</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Need Score</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Final Score</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Score Bar</th>
            </tr>
          </thead>
          <tbody>
            {sortedCandidates.map((candidate, idx) => {
              const isSelected = selectedBeneficiary?.id === candidate.member.id;
              const scorePercent = (candidate.finalScore / maxScore) * 100;

              return (
                <tr
                  key={candidate.member.id}
                  className={`border-b border-gray-200 transition-colors ${
                    isSelected ? 'bg-green-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      isSelected ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`font-semibold ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                        {candidate.member.name}
                        {isSelected && ' ✓'}
                      </p>
                      <p className="text-xs text-gray-500">{candidate.member.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {candidate.waitingPeriodMonths}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {candidate.lastRotationPosition}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-semibold ${
                      candidate.needRating > 70 ? 'text-red-600' :
                      candidate.needRating > 40 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {candidate.needRating}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-gray-900">
                      {candidate.finalScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isSelected ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Score Breakdown Component
 * Shows detailed scoring for selected beneficiary
 */
export function ScoreBreakdown({ candidate }: { candidate: SelectionCandidate }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <span>Score Breakdown for {candidate.member.name}</span>
      </h3>

      <div className="space-y-4">
        {/* Waiting Period Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Waiting Period Score</span>
            </span>
            <span className="text-sm font-bold text-gray-900">
              {(candidate.waitingPeriodMonths * 10).toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            Waiting {candidate.waitingPeriodMonths} months since last payment
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${Math.min(candidate.waitingPeriodMonths * 5, 100)}%` }}
            />
          </div>
        </div>

        {/* Contribution Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Contribution Score</span>
            <span className="text-sm font-bold text-gray-900">
              {candidate.contributionRating.toFixed(0)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            Total contributions: {formatCurrency(candidate.contributionRating)}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-green-600"
              style={{ width: `${Math.min((candidate.contributionRating / 40000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Need Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Need Rating</span>
            <span className={`text-sm font-bold ${
              candidate.needRating > 70 ? 'text-red-600' :
              candidate.needRating > 40 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {candidate.needRating}/100
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            {candidate.needRating > 70 ? 'High need' :
           candidate.needRating > 40 ? 'Moderate need' : 'Lower need'}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                candidate.needRating > 70 ? 'bg-red-600' :
                candidate.needRating > 40 ? 'bg-yellow-600' : 'bg-green-600'
              }`}
              style={{ width: `${candidate.needRating}%` }}
            />
          </div>
        </div>

        {/* Final Score */}
        <div className="pt-4 border-t border-gray-200 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Final Score</span>
            <span className="text-2xl font-bold text-green-600">
              {candidate.finalScore.toFixed(1)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <div
              className="h-3 rounded-full bg-green-600"
              style={{ width: `${Math.min((candidate.finalScore / 100) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Eligibility Summary Component
 */
export function EligibilitySummary({ candidates }: { candidates: SelectionCandidate[] }) {
  const eligibleCount = candidates.length;
  const neverReceivedCount = candidates.filter(c => c.lastRotationPosition === 0).length;
  const highNeedCount = candidates.filter(c => c.needRating > 70).length;
  const waitingMonthsAvg = candidates.reduce((sum, c) => sum + c.waitingPeriodMonths, 0) / candidates.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-600 mb-2">Eligible Members</p>
        <p className="text-2xl font-bold text-blue-600">{eligibleCount}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-600 mb-2">Never Received</p>
        <p className="text-2xl font-bold text-green-600">{neverReceivedCount}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-600 mb-2">High Need Members</p>
        <p className="text-2xl font-bold text-red-600">{highNeedCount}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-600 mb-2">Avg Waiting Period</p>
        <p className="text-2xl font-bold text-purple-600">{waitingMonthsAvg.toFixed(1)} mo</p>
      </div>
    </div>
  );
}

/**
 * Algorithm Explanation Component
 */
export function AlgorithmExplanation({ strategy }: { strategy: RotationStrategy }) {
  const explanations: Record<RotationStrategy, string> = {
    round_robin: 'Round-robin ensures fair rotation by prioritizing members who haven\'t received payments. Those waiting longer get higher priority, with bonus points for completing installments.',
    contribution_based: 'Members who contribute more receive priority. The algorithm balances contribution amounts with how many times they\'ve already received payments.',
    need_based: 'Members with higher need scores get priority. This strategy ensures support goes to those who need it most while still maintaining fairness.',
    lottery: 'All eligible members have an equal chance of being selected, regardless of contributions or need. Pure random selection ensures unpredictability.',
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-900">How It Works</h4>
          <p className="text-sm text-blue-800 mt-1">{explanations[strategy]}</p>
        </div>
      </div>
    </div>
  );
}
