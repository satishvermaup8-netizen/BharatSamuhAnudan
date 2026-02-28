/**
 * Beneficiary Rotation Integration Example
 * Complete working example showing all rotation features in action
 */

import React, { useState } from 'react';
import { BeneficiaryRotationDashboard } from './BeneficiaryRotationDashboard';

/**
 * Example Page Component
 * Shows how to implement beneficiary rotation in your application
 */
export function BeneficiaryRotationExamplePage() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!showDashboard ? (
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Beneficiary Rotation System
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Fair, transparent, and automated distribution management
            </p>
          </div>

          {/* Feature Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-600">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Smart Selection</h2>
              <ul className="space-y-2 text-gray-700 text-sm mb-6">
                <li>✓ Round-robin fair rotation</li>
                <li>✓ Contribution-based weighting</li>
                <li>✓ Need-based prioritization</li>
                <li>✓ Lottery random selection</li>
              </ul>
              <p className="text-gray-600 text-sm">
                Multiple selection algorithms ensure fair distribution across all members.
                Each algorithm considers different factors for the most equitable outcome.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-600">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Multi-Step Approval</h2>
              <ul className="space-y-2 text-gray-700 text-sm mb-6">
                <li>✓ Role-based approvals</li>
                <li>✓ Committee verification</li>
                <li>✓ Expiration tracking</li>
                <li>✓ Approval progress monitoring</li>
              </ul>
              <p className="text-gray-600 text-sm">
                Transparent approval workflow with detailed history and comments.
                Track who approved, when, and their reasoning.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-purple-600">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Payment Scheduling</h2>
              <ul className="space-y-2 text-gray-700 text-sm mb-6">
                <li>✓ Installment-based payments</li>
                <li>✓ Due date tracking</li>
                <li>✓ Completion monitoring</li>
                <li>✓ Payment history</li>
              </ul>
              <p className="text-gray-600 text-sm">
                Flexible payment plans with automated tracking and status monitoring.
                Mark installments as completed and generate payment reports.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-orange-600">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Metrics & Analytics</h2>
              <ul className="space-y-2 text-gray-700 text-sm mb-6">
                <li>✓ Fairness scoring</li>
                <li>✓ Eligibility metrics</li>
                <li>✓ Distribution analysis</li>
                <li>✓ Audit trails</li>
              </ul>
              <p className="text-gray-600 text-sm">
                Comprehensive analytics showing selection fairness, eligibility status,
                and complete audit trails for compliance.
              </p>
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Guide</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Essential Types</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// From @/lib/beneficiaryRotation.ts
interface GroupMember {
  id: string;
  name: string;
  email: string;
  monthlyContribution: number;
  needScore: number; // 0-100
  lastReceivedAt: string | null;
  joinedAt: string;
}

interface BeneficiarySelection {
  id: string;
  roundId: string;
  selectedMemberId: string;
  selectionMethod: 'round-robin' | 'contribution' | 'need' | 'lottery';
  candidates: SelectionCandidate[];
  metadata: { fairnessScore: number; transparencyLevel: string };
}

interface DistributionApproval {
  id: string;
  selectionId: string;
  status: 'pending' | 'approved' | 'rejected';
  requiredApprovals: number;
  approvals: ApprovalRecord[];
  expiresAt: string;
}

interface PaymentSchedule {
  id: string;
  approvalId: string;
  beneficiaryId: string;
  totalAmount: number;
  installmentCount: number;
  installments: PaymentInstallment[];
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Engine Usage</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { BeneficiaryRotationEngine } from '@/lib/beneficiaryRotation';

// Calculate eligibility score
const score = BeneficiaryRotationEngine.calculateEligibilityScore(
  member,
  currentRound,
  'round-robin',
  allMembers
);

// Select beneficiary
const selection = BeneficiaryRotationEngine.selectBeneficiary(
  allMembers,
  currentRound,
  'round-robin'
);

// Check eligibility
const isEligible = BeneficiaryRotationEngine.isEligible(
  member,
  currentRound,
  { minMonthsMembership: 12, minContributions: 6 }
);

// Calculate metrics
const metrics = BeneficiaryRotationEngine.calculateMetrics(
  selection,
  allMembers,
  currentRound
);`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dashboard Integration</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { BeneficiaryRotationDashboard } from '@/components/rotation/BeneficiaryRotationDashboard';

// In your page or component
export function GroupManagementPage() {
  return (
    <BeneficiaryRotationDashboard
      groupId="group-001"
      groupName="Mutual Aid Group"
      currentUserId="user-123"
      currentUserRole="admin"
      onSelectionComplete={(selection) => {
        console.log('Beneficiary selected:', selection);
      }}
      onApprovalComplete={(approval) => {
        console.log('Approval processed:', approval);
      }}
    />
  );
}`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Individual Components</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Use individual components for custom layouts
import {
  BeneficiarySelectionUI,
  SelectionCriteriaCard,
  CandidateComparison,
  ScoreBreakdown,
  ApprovalTimeline,
  ApprovalRequestCard,
  PaymentScheduleViewer,
  InstallmentTimeline,
  PaymentSummaryCard,
} from '@/components/rotation';

// Example: Custom approval interface
<ApprovalTimeline
  approval={approval}
  beneficiaryName="John Doe"
  amount={5000}
/>

<ApprovalRequestCard
  approval={approval}
  beneficiaryName="John Doe"
  amount={5000}
  onApprove={handleApprove}
  currentUserId="user-123"
  currentUserRole="committee"
/>`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Selection Strategies</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Different selection strategies available

// Round Robin: Fair rotation, prioritizes never-received members
calculateEligibilityScore(member, round, 'round-robin', members)

// Contribution Based: Weights member contributions
calculateEligibilityScore(member, round, 'contribution', members)

// Need Based: Uses member need scores (0-100)
calculateEligibilityScore(member, round, 'need', members)

// Lottery: Random selection for equality
calculateEligibilityScore(member, round, 'lottery', members)`}
                </pre>
              </div>
            </div>
          </div>

          {/* Key Features Checklist */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Selection Engine</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>4 selection algorithms (Round Robin, Contribution, Need, Lottery)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Eligibility criteria enforcement</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Fairness scoring (0-1)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Transparent ranking system</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Approval Workflow</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Multi-step approval process</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Role-based access control</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Expiration tracking with 7-day default</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Comments and rejection reasons</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Payment Scheduling</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Flexible installment creation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Due date management</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Completion tracking</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>CSV export functionality</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">UI Components</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>5-tab dashboard interface</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Candidate comparison table</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Payment timeline visualization</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Approval progress tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => setShowDashboard(true)}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition shadow-lg"
            >
              View Interactive Dashboard →
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setShowDashboard(false)}
            className="m-4 px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg shadow hover:bg-gray-50"
          >
            ← Back to Examples
          </button>
          <BeneficiaryRotationDashboard
            groupId="group-001"
            groupName="Mutual Aid Group"
            currentUserId="user-001"
            currentUserRole="admin"
          />
        </div>
      )}
    </div>
  );
}

export default BeneficiaryRotationExamplePage;
