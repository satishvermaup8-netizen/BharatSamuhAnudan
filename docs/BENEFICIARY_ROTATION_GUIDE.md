# Beneficiary Rotation System - Complete Documentation

## Overview

The Beneficiary Rotation System is a comprehensive solution for managing fair, transparent, and automated distribution of funds within groups. It combines intelligent selection algorithms, multi-step approval workflows, and flexible payment scheduling to ensure equitable resource distribution.

**Key Capabilities:**
- **Fair Selection**: Multiple algorithms (Round Robin, Contribution-based, Need-based, Lottery)
- **Approval Control**: Role-based multi-step approval process with expiration tracking
- **Payment Management**: Flexible installment-based payment schedules with completion tracking
- **Complete Transparency**: Audit trails, fairness scoring, and detailed metrics

---

## Architecture

### Component Structure

```
src/lib/beneficiaryRotation.ts
├── Types & Interfaces
│   ├── GroupMember
│   ├── RotationRound
│   ├── BeneficiarySelection
│   ├── DistributionApproval
│   └── PaymentSchedule
└── Core Classes
    ├── BeneficiaryRotationEngine
    ├── PaymentScheduler
    └── ApprovalWorkflow

src/components/rotation/
├── BeneficiarySelection.tsx (Selection UI components)
├── ApprovalWorkflow.tsx (Approval UI components)
├── PaymentSchedule.tsx (Payment UI components)
├── BeneficiaryRotationDashboard.tsx (Main dashboard)
└── RotationExample.tsx (Integration examples)
```

### Data Flow

```
Members Data
    ↓
[Selection Engine] → Eligibility Analysis → Candidate Ranking
    ↓
BeneficiarySelection
    ↓
[Approval Workflow] → Multi-step Approvals → Approval History
    ↓
DistributionApproval (Approved)
    ↓
[Payment Scheduler] → Create Schedule → Track Installments
    ↓
PaymentSchedule
    ↓
[Completion Tracking] → Generate Reports → Audit Trail
```

---

## Core Types & Interfaces

### GroupMember

Represents a member of the group eligible for rotation.

```typescript
interface GroupMember {
  id: string;
  name: string;
  email: string;
  monthlyContribution: number;
  needScore: number; // 0-100, higher = more need
  lastReceivedAt: string | null; // ISO date string
  joinedAt: string; // ISO date string
}
```

**Usage:**
- Store member information in your database
- Update `lastReceivedAt` after each distribution
- Use `needScore` for need-based selection

### RotationRound

Represents a distribution cycle.

```typescript
interface RotationRound {
  id: string;
  groupId: string;
  roundNumber: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  totalAmount: number;
  distributionMethod: string;
}
```

**Usage:**
- Create new rounds periodically (monthly/quarterly)
- Track round status throughout lifecycle
- Store total amount available for distribution

### BeneficiarySelection

Result of the selection algorithm.

```typescript
interface BeneficiarySelection {
  id: string;
  roundId: string;
  selectedMemberId: string;
  selectedMemberName: string;
  selectionMethod: 'round-robin' | 'contribution' | 'need' | 'lottery';
  totalEligibleMembers: number;
  eligibilityCriteria: {
    minMonthsMembership: number;
    minContributions: number;
    noOutstandingDebts: boolean;
    notReceivedInMonths: number;
  };
  candidates: SelectionCandidate[];
  selectedAt: string;
  approvalRequired: boolean;
  metadata: {
    fairnessScore: number; // 0-1
    transparencyLevel: 'low' | 'medium' | 'high';
    algorithmVersion: string;
  };
}

interface SelectionCandidate {
  member: GroupMember;
  eligibilityScore: number;
  waitingPeriodMonths: number;
  needRating: number;
  contributionRating: number;
  finalScore: number;
}
```

**Usage:**
- Display candidate comparison to stakeholders
- Show scoring breakdown for transparency
- Store for audit trail

### DistributionApproval

Multi-step approval workflow tracking.

```typescript
interface DistributionApproval {
  id: string;
  selectionId: string;
  status: 'pending' | 'approved' | 'rejected';
  requiredApprovals: number;
  approvals: ApprovalRecord[];
  rejectionReason: string | null;
  createdAt: string;
  expiresAt: string;
}

interface ApprovalRecord {
  approverId: string;
  approverName: string;
  approverRole: 'committee' | 'treasurer' | 'admin';
  timestamp: string;
  comments?: string;
}
```

**Usage:**
- Track approval progress in real-time
- Check expiration for time-sensitive approvals
- Log approver comments for audit

### PaymentSchedule

Installment-based payment plan.

```typescript
interface PaymentSchedule {
  id: string;
  approvalId: string;
  beneficiaryId: string;
  totalAmount: number;
  currency: string;
  installmentCount: number;
  installments: PaymentInstallment[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentInstallment {
  number: number;
  dueDate: string;
  amount: number;
  completed: boolean;
  completedDate: string | null;
}
```

**Usage:**
- Create installment plans for distributions
- Mark installments as completed
- Track payment history

---

## BeneficiaryRotationEngine

Core selection algorithm engine.

### Static Methods

#### selectBeneficiary()

Select the next beneficiary using specified strategy.

```typescript
BeneficiaryRotationEngine.selectBeneficiary(
  members: GroupMember[],
  currentRound: RotationRound,
  strategy: 'round-robin' | 'contribution' | 'need' | 'lottery'
): GroupMember
```

**Strategies:**

1. **Round Robin** (Default)
   - Prioritizes members who never received amount
   - Then by waiting period (longest first)
   - Then by installments completed
   - Ensures everyone gets equal turns

2. **Contribution Based**
   - Weights member contributions against group average
   - Higher contributors get priority
   - Formula: `score = contribution / avgContribution * waitingMonths`

3. **Need Based**
   - Uses member need scores (0-100)
   - Higher need scores get priority
   - Formula: `score = needScore * waitingMonths`

4. **Lottery**
   - Random selection among eligible members
   - Provides pure equality
   - All eligible members have equal chance

#### calculateEligibilityScore()

Calculate selection score for a member.

```typescript
BeneficiaryRotationEngine.calculateEligibilityScore(
  member: GroupMember,
  round: RotationRound,
  strategy: string,
  allMembers: GroupMember[]
): number
```

**Returns:** Score between 0-100 (higher = more eligible)

#### isEligible()

Check if member meets eligibility criteria.

```typescript
BeneficiaryRotationEngine.isEligible(
  member: GroupMember,
  round: RotationRound,
  criteria: EligibilityCriteria
): boolean
```

**Default Criteria:**
- Minimum 12 months membership
- Minimum 6 contributions
- No outstanding debts
- Not received amount in past 12 months

#### calculateMetrics()

Generate fairness and eligibility metrics.

```typescript
BeneficiaryRotationEngine.calculateMetrics(
  selection: BeneficiarySelection,
  members: GroupMember[],
  round: RotationRound
): SelectionMetrics
```

---

## UI Components

### BeneficiaryRotationDashboard

Main dashboard component with 5 tabs.

```tsx
<BeneficiaryRotationDashboard
  groupId="group-001"
  groupName="Mutual Aid Group"
  currentUserId="user-123"
  currentUserRole="admin"
  onSelectionComplete={(selection) => console.log(selection)}
  onApprovalComplete={(approval) => console.log(approval)}
/>
```

**Tabs:**
1. **Overview**: Statistics, current selection, fairness score
2. **Selection**: Candidate ranking, scoring breakdown
3. **Approval**: Approval timeline, multi-step process
4. **Payment**: Installment tracking, payment status
5. **History**: Past distributions (future feature)

### BeneficiarySelectionUI

Display and analyze selection results.

```tsx
<BeneficiarySelectionUI
  selection={selection}
  beneficiaryName="John Doe"
  totalAmount={5000}
/>
```

**Subcomponents:**
- `SelectionCriteriaCard`: Algorithm and criteria explanation
- `CandidateComparison`: Ranking table with scores
- `ScoreBreakdown`: Detailed score visualization
- `EligibilitySummary`: Key statistics
- `AlgorithmExplanation`: How selection was made

### ApprovalWorkflowUI

Multi-step approval process.

```tsx
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
/>

<ApproverList approval={approval} />
```

**Features:**
- Approval progress tracking (3/3 approvals)
- Approve/Reject buttons with comments
- Approver history and timeline
- Role-based access control
- Expiration tracking

### PaymentScheduleViewer

Installment tracking and management.

```tsx
<PaymentScheduleViewer
  schedule={schedule}
  beneficiaryName="John Doe"
  onInstallmentMarked={handleMark}
  readOnly={false}
/>
```

**Components:**
- `PaymentSummaryCard`: Total, paid, remaining amounts
- `InstallmentTimeline`: Visual progress timeline
- `InstallmentDetailsTable`: Detailed payment table
- Export to CSV functionality

---

## Integration Guide

### Basic Setup

1. **Import the dashboard:**

```tsx
import { BeneficiaryRotationDashboard } from '@/components/rotation/BeneficiaryRotationDashboard';

export function GroupPage() {
  return (
    <BeneficiaryRotationDashboard
      groupId={groupId}
      groupName={groupName}
      currentUserId={userId}
      currentUserRole="admin"
    />
  );
}
```

2. **Or use individual components:**

```tsx
import {
  BeneficiarySelectionUI,
  ApprovalWorkflow,
  PaymentScheduleViewer,
} from '@/components/rotation';

// Custom layout combining components
```

### Advanced Usage

1. **Custom selection:**

```tsx
import { BeneficiaryRotationEngine } from '@/lib/beneficiaryRotation';

const selection = BeneficiaryRotationEngine.selectBeneficiary(
  members,
  round,
  'contribution'
);

const candidates = members.map(member => ({
  member,
  score: BeneficiaryRotationEngine.calculateEligibilityScore(
    member,
    round,
    'contribution',
    members
  ),
}));
```

2. **Check eligibility:**

```tsx
const isEligible = BeneficiaryRotationEngine.isEligible(
  member,
  round,
  {
    minMonthsMembership: 6,
    minContributions: 3,
    noOutstandingDebts: true,
  }
);
```

3. **Generate metrics:**

```tsx
const metrics = BeneficiaryRotationEngine.calculateMetrics(
  selection,
  members,
  round
);

console.log(`Fairness Score: ${metrics.fairnessScore}`);
console.log(`Eligible: ${metrics.eligibleCount}/${metrics.totalMembers}`);
```

### Data Persistence

The system uses mock data by default. For production:

1. **Replace mock data generation:**

```tsx
// Instead of generateMockGroupMembers()
const members = await fetchGroupMembers(groupId);

// Instead of generateMockRotationRound()
const round = await fetchCurrentRound(groupId);
```

2. **Store selections:**

```tsx
const selection = BeneficiaryRotationEngine.selectBeneficiary(...);
await saveSelection(selection);
```

3. **Track approvals:**

```tsx
const approval = ApprovalWorkflow.createApproval(selection);
await saveApproval(approval);
```

4. **Log payments:**

```tsx
const schedule = PaymentScheduler.createSchedule(...);
await savePaymentSchedule(schedule);
```

---

## Selection Algorithms Explained

### Round Robin (Recommended)

Best for: Groups with equal contribution expectations

**Logic:**
1. Filter eligible members
2. Prioritize never-received members
3. Then by longest waiting period
4. Then by most installments completed
5. Return highest-scoring member

**Fairness:** ⭐⭐⭐⭐⭐ Highest

### Contribution Based

Best for: Groups with varying contributions

**Logic:**
1. Calculate member contribution vs. group average
2. Weight by waiting period
3. Higher contributors -> higher priority
4. Return highest-scoring member

**Formula:** `score = (contribution / avgContribution) * monthsSinceLastReceived`

**Fairness:** ⭐⭐⭐⭐ High

### Need Based

Best for: Groups prioritizing member hardship

**Logic:**
1. Use member's declared need score (0-100)
2. Weight by waiting period
3. Higher need -> higher priority
4. Return highest-scoring member

**Formula:** `score = needScore * monthsSinceLastReceived`

**Fairness:** ⭐⭐⭐ Medium (depends on need assessment accuracy)

### Lottery

Best for: Groups prioritizing pure randomness

**Logic:**
1. Filter eligible members
2. Randomly select one
3. Return selected member

**Fairness:** ⭐⭐⭐ Medium (pure chance, may be unfair in practice)

---

## Approval Workflow

### Process

1. **Selection Created** → Selection candidates shown, best candidate highlighted
2. **Approval Requested** → Committee approvers notified
3. **Role-Based Review** → Committee members review and approve
4. **Multi-Step Completion** → All required approvals collected
5. **Approval Expires** → If not completed within 7 days, selection expires

### Roles

- **Committee**: Can approve selections (default: 3 required approvals)
- **Treasurer**: Can approve and manage payments
- **Admin**: Can approve, override, and configure

### Access Control

- Only non-approvers with pending approval can approve
- Users who already approved cannot approve again
- Read-only mode hides action buttons

---

## Payment Scheduling

### Payment Process

1. **Approval Complete** → Payment schedule created
2. **Installments Generated** → Divided into manageable amounts
3. **Due Date Tracking** → Monitor upcoming and overdue payments
4. **Completion Marking** → Mark installments as paid
5. **Status Monitoring** → Track completion percentage

### Features

- **Flexible Schedules**: 2-12 installments (customizable)
- **Due Date Management**: Monthly or custom intervals
- **Overdue Tracking**: Automatic overdue detection
- **Completion History**: Track when installments paid
- **Export Capability**: Export to CSV for record-keeping

### Status Badges

- **Completed** ✓ Green – Installment fully paid
- **Pending** ⏱ Yellow – Awaiting payment
- **Overdue** ⚠ Red – Past due date
- **Partial** 📊 Blue – Partially completed

---

## Best Practices

### Selection

1. **Define clear eligibility criteria** before selection
2. **Communicate selection method** to all members
3. **Use Round Robin** as default for fairness
4. **Document selection reasoning** for transparency
5. **Review fairness score** (should be 0.8+)

### Approval

1. **Require minimum 3 approvals** from different roles
2. **Set reasonable expiration** (7-14 days)
3. **Document all approvals** with comments
4. **Ensure audit trail** for compliance
5. **Allow rejection** with detailed reasoning

### Payment

1. **Create reasonable installments** (not too many)
2. **Space installments evenly** (monthly recommended)
3. **Track completion** in real-time
4. **Follow up on overdue** payments promptly
5. **Export schedules** for record-keeping annually

### Transparency

1. **Show candidate rankings** to stakeholders
2. **Explain algorithm choice** publicly
3. **Display fairness metrics** prominently
4. **Log all decisions** with timestamps
5. **Archive historical data** for review

---

## Example Workflow

### Step 1: Create Round

```tsx
const round = {
  id: 'round-001',
  groupId: 'group-001',
  roundNumber: 5,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'active',
  totalAmount: 5000,
};
```

### Step 2: Get Members

```tsx
const members = [
  {
    id: 'member-001',
    name: 'John Doe',
    monthlyContribution: 500,
    needScore: 75,
    lastReceivedAt: null,
    joinedAt: '2023-01-15',
  },
  // ... more members
];
```

### Step 3: Select Beneficiary

```tsx
const selected = BeneficiaryRotationEngine.selectBeneficiary(
  members,
  round,
  'round-robin'
);

const selection = {
  id: 'selection-001',
  roundId: round.id,
  selectedMemberId: selected.id,
  selectedMemberName: selected.name,
  // ... more details
};
```

### Step 4: Create Approval

```tsx
const approval = {
  id: 'approval-001',
  selectionId: selection.id,
  status: 'pending',
  requiredApprovals: 3,
  approvals: [],
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

// Committee members approve
approval = ApprovalWorkflow.addApproval(
  approval,
  'user-002',
  'Rajesh Kumar',
  'committee',
  'approved',
  'All criteria met'
);
```

### Step 5: Create Payment Schedule

```tsx
const schedule = PaymentScheduler.createSchedule(
  approval.id,
  selection.selectedMemberId,
  5000,
  6,
  'INR'
);

// Track payments
schedule = PaymentScheduler.completeInstallment(
  schedule,
  0,
  new Date().toISOString()
);

const completion = PaymentScheduler.getCompletionPercentage(schedule);
// Returns: 16.67% (1 of 6 complete)
```

---

## Metrics & Reporting

### Available Metrics

```typescript
interface SelectionMetrics {
  fairnessScore: number; // 0-1, how fair is the selection
  eligibleCount: number; // Number of eligible members
  totalMembers: number; // Total group members
  mostNeedy: {
    member: GroupMember;
    needScore: number;
  };
  longestWaiting: {
    member: GroupMember;
    monthsSince: number;
  };
  highestContributor: {
    member: GroupMember;
    amount: number;
  };
}
```

### Fairness Score

Calculated based on:
- Selection method (Round Robin = 1.0)
- Eligible member diversity (more eligible = higher)
- Historical distribution balance
- Need vs. fairness tradeoff

**Interpretation:**
- 0.9-1.0: Excellent fairness
- 0.8-0.9: Good fairness
- 0.7-0.8: Acceptable fairness
- < 0.7: Review selection criteria

---

## Troubleshooting

### Issue: Low Fairness Score

**Solution:**
1. Check eligibility criteria (too strict?)
2. Review member need scores (accurate?)
3. Consider switching to Round Robin
4. Verify data quality

### Issue: Selection Rejected

**Solution:**
1. Provide detailed rejection reason
2. Update member information
3. Adjust eligibility criteria
4. Try different selection algorithm

### Issue: Payment Overdue

**Solution:**
1. Follow up with beneficiary
2. Check for data entry errors
3. Allow grace period if needed
4. Log payment reason/delay

### Issue: Low Participation

**Solution:**
1. Ensure approval process not too lengthy
2. Communicate selection timeline
3. Simplify approval workflow
3. Set realistic deadlines

---

## File Locations

- **Core Logic**: [src/lib/beneficiaryRotation.ts](src/lib/beneficiaryRotation.ts)
- **UI Components**: [src/components/rotation/](src/components/rotation/)
- **Dashboard**: [src/components/rotation/BeneficiaryRotationDashboard.tsx](src/components/rotation/BeneficiaryRotationDashboard.tsx)
- **Examples**: [src/components/rotation/RotationExample.tsx](src/components/rotation/RotationExample.tsx)

---

## Support & Updates

For issues or feature requests:
1. Check existing documentation
2. Review example implementations
3. Test with mock data first
4. Document expected vs. actual behavior

---

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Production Ready
