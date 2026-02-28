/**
 * Beneficiary Rotation Types and Utilities
 * Fair distribution algorithm for group fund members
 */

export type RotationStrategy = 'round_robin' | 'contribution_based' | 'need_based' | 'lottery';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'pending_payment';
export type PaymentStatus = 'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface GroupMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalContributions: number;
  timesReceived: number;
  installmentsCompleted: number;
  isActive: boolean;
  needScore?: number; // For need-based allocation (0-100)
  lastReceivedDate?: string;
}

export interface RotationRound {
  id: string;
  groupId: string;
  roundNumber: number;
  startDate: string;
  expectedEndDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'halted';
  allocatedAmount: number;
  beneficiary?: GroupMember;
  notes?: string;
}

export interface BeneficiarySelection {
  id: string;
  roundId: string;
  candidates: SelectionCandidate[];
  selectedBeneficiary: GroupMember;
  selectionDate: string;
  selectionMethod: RotationStrategy;
  score?: Record<string, number>;
  reason?: string;
}

export interface SelectionCandidate {
  member: GroupMember;
  eligibilityScore: number;
  lastRotationPosition?: number;
  waitingPeriodMonths: number;
  needRating: number;
  contributionRating: number;
  finalScore: number;
}

export interface DistributionApproval {
  id: string;
  selectionId: string;
  roundId: string;
  beneficiaryId: string;
  amount: number;
  status: ApprovalStatus;
  requiredApprovals: number;
  approvals: ApprovalRecord[];
  createdAt: string;
  expiresAt: string;
  rejectionReason?: string;
}

export interface ApprovalRecord {
  approverId: string;
  approverName: string;
  approverRole: 'committee' | 'treasurer' | 'admin';
  decision: 'approved' | 'rejected';
  timestamp: string;
  comments?: string;
}

export interface PaymentSchedule {
  id: string;
  approvalId: string;
  beneficiaryId: string;
  totalAmount: number;
  installments: PaymentInstallment[];
  status: PaymentStatus;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentInstallment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  completedDate?: string;
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
}

export interface RotationMetrics {
  totalMembers: number;
  membersReceived: number;
  membersWaiting: number;
  averageTimeBetWeenPayments: number;
  fairnessIndex: number; // 0-1, where 1 is perfectly fair
  estimatedRotationYears: number;
}

// Fair Selection Algorithm
export class BeneficiaryRotationEngine {
  /**
   * Calculate eligibility score for a member
   * Combines multiple factors for fair selection
   */
  static calculateEligibilityScore(
    member: GroupMember,
    strategy: RotationStrategy,
    allMembers: GroupMember[]
  ): number {
    let score = 0;

    if (strategy === 'round_robin') {
      score = this.calculateRoundRobinScore(member, allMembers);
    } else if (strategy === 'contribution_based') {
      score = this.calculateContributionScore(member, allMembers);
    } else if (strategy === 'need_based') {
      score = this.calculateNeedScore(member, allMembers);
    } else if (strategy === 'lottery') {
      score = Math.random() * 100;
    }

    return score;
  }

  /**
   * Round Robin: Fair rotation ensuring everyone gets a turn
   * Prioritizes those who haven't received yet
   */
  private static calculateRoundRobinScore(
    member: GroupMember,
    allMembers: GroupMember[]
  ): number {
    // Members with 0 payments get highest priority
    if (member.timesReceived === 0) {
      return 100 + (100 - member.installmentsCompleted); // Bonus for installments completed
    }

    // Calculate waiting period (months since last received)
    const lastReceived = member.lastReceivedDate ? new Date(member.lastReceivedDate) : new Date(member.joinDate);
    const monthsWaiting = Math.floor((Date.now() - lastReceived.getTime()) / (1000 * 60 * 60 * 24 * 30));

    // Higher score for longer waiting period
    return monthsWaiting * 10;
  }

  /**
   * Contribution Based: Higher contributions get priority
   */
  private static calculateContributionScore(
    member: GroupMember,
    allMembers: GroupMember[]
  ): number {
    const avgContribution = allMembers.reduce((sum, m) => sum + m.totalContributions, 0) / allMembers.length;

    // Score weighted by contribution amount and times received
    const contributionWeight = (member.totalContributions / avgContribution) * 50;
    const receivedWeight = (1 / (member.timesReceived + 1)) * 50;

    return contributionWeight + receivedWeight;
  }

  /**
   * Need Based: Members with higher need scores get priority
   */
  private static calculateNeedScore(
    member: GroupMember,
    allMembers: GroupMember[]
  ): number {
    const needRating = member.needScore || 0;
    const avgNeed = allMembers.reduce((sum, m) => sum + (m.needScore || 0), 0) / allMembers.length;

    // Higher need rating gets higher score
    return (needRating / avgNeed) * 100;
  }

  /**
   * Select beneficiary using chosen strategy
   */
  static selectBeneficiary(
    eligibleMembers: GroupMember[],
    strategy: RotationStrategy,
    allMembers: GroupMember[]
  ): { beneficiary: GroupMember; candidates: SelectionCandidate[] } {
    // Calculate scores for all eligible members
    const candidates: SelectionCandidate[] = eligibleMembers.map(member => {
      const eligibilityScore = this.calculateEligibilityScore(member, strategy, allMembers);
      const lastReceived = member.lastReceivedDate ? new Date(member.lastReceivedDate) : new Date(member.joinDate);
      const waitingPeriodMonths = Math.floor((Date.now() - lastReceived.getTime()) / (1000 * 60 * 60 * 24 * 30));

      return {
        member,
        eligibilityScore,
        lastRotationPosition: member.timesReceived,
        waitingPeriodMonths,
        needRating: member.needScore || 0,
        contributionRating: member.totalContributions,
        finalScore: eligibilityScore,
      };
    });

    // Sort by final score (descending)
    candidates.sort((a, b) => b.finalScore - a.finalScore);

    return {
      beneficiary: candidates[0].member,
      candidates,
    };
  }

  /**
   * Validate if eligible for current round
   */
  static isEligible(member: GroupMember, lastReceivedDate?: string): boolean {
    // Must be active
    if (!member.isActive) return false;

    // Must have joined at least 1 month ago
    const joinDate = new Date(member.joinDate);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    if (joinDate > oneMonthAgo) return false;

    // Must have completed at least 1 installment
    if (member.installmentsCompleted < 1) return false;

    // Cannot receive twice in same month
    if (lastReceivedDate) {
      const lastReceived = new Date(lastReceivedDate);
      const oneMonthAfter = new Date(lastReceived);
      oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);
      if (new Date() < oneMonthAfter) return false;
    }

    return true;
  }

  /**
   * Calculate rotation metrics
   */
  static calculateMetrics(members: GroupMember[], totalRounds: number): RotationMetrics {
    const membersReceived = members.filter(m => m.timesReceived > 0).length;
    const membersWaiting = members.filter(m => m.timesReceived === 0).length;
    const avgPaymentGap = members
      .filter(m => m.lastReceivedDate)
      .map(m => {
        const lastReceived = new Date(m.lastReceivedDate!);
        return Math.floor((Date.now() - lastReceived.getTime()) / (1000 * 60 * 60 * 24 * 30));
      })
      .reduce((sum, val) => sum + val, 0) / Math.max(membersReceived, 1);

    // Fairness index: how evenly distributed (0 = very uneven, 1 = perfectly even)
    const idealReceive = totalRounds / members.length;
    const variance = members.reduce(
      (sum, m) => sum + Math.pow(m.timesReceived - idealReceive, 2),
      0
    ) / members.length;
    const fairnessIndex = Math.max(0, 1 - variance / 100);

    const estimatedYears = (members.length * 12) / totalRounds;

    return {
      totalMembers: members.length,
      membersReceived,
      membersWaiting,
      averageTimeBetWeenPayments: avgPaymentGap,
      fairnessIndex,
      estimatedRotationYears: estimatedYears,
    };
  }
}

// Payment Scheduling
export class PaymentScheduler {
  /**
   * Create payment schedule based on installment count
   */
  static createSchedule(
    approvalId: string,
    beneficiaryId: string,
    amount: number,
    installmentCount: number = 3,
    startDate: Date = new Date()
  ): PaymentSchedule {
    const installmentAmount = Math.floor(amount / installmentCount);
    const installments: PaymentInstallment[] = [];

    for (let i = 0; i < installmentCount; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      installments.push({
        id: `inst_${approvalId}_${i + 1}`,
        installmentNumber: i + 1,
        amount: i === installmentCount - 1 ? amount - installmentAmount * i : installmentAmount,
        dueDate: dueDate.toISOString(),
        status: 'scheduled',
      });
    }

    return {
      id: `schedule_${approvalId}`,
      approvalId,
      beneficiaryId,
      totalAmount: amount,
      installments,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Process completed installment
   */
  static completeInstallment(
    schedule: PaymentSchedule,
    installmentNumber: number,
    transactionId: string
  ): PaymentSchedule {
    const installment = schedule.installments.find(i => i.installmentNumber === installmentNumber);

    if (!installment) throw new Error('Installment not found');

    installment.status = 'completed';
    installment.completedDate = new Date().toISOString();
    installment.transactionId = transactionId;

    // Check if all completed
    const allCompleted = schedule.installments.every(i => i.status === 'completed');
    if (allCompleted) {
      schedule.status = 'completed';
      schedule.completedAt = new Date().toISOString();
    }

    return schedule;
  }

  /**
   * Get upcoming payment due date
   */
  static getNextDueDate(schedule: PaymentSchedule): Date | null {
    const pending = schedule.installments.find(i => i.status === 'scheduled');
    return pending ? new Date(pending.dueDate) : null;
  }

  /**
   * Check if all installments completed
   */
  static isScheduleComplete(schedule: PaymentSchedule): boolean {
    return schedule.status === 'completed';
  }

  /**
   * Calculate completion percentage
   */
  static getCompletionPercentage(schedule: PaymentSchedule): number {
    const completed = schedule.installments.filter(i => i.status === 'completed').length;
    return (completed / schedule.installments.length) * 100;
  }
}

// Approval Workflow
export class ApprovalWorkflow {
  /**
   * Create new distribution approval
   */
  static createApproval(
    selectionId: string,
    roundId: string,
    beneficiaryId: string,
    amount: number,
    requiredApprovals: number = 2
  ): DistributionApproval {
    const createdAt = new Date();
    const expiresAt = new Date(createdAt);
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    return {
      id: `approval_${roundId}_${beneficiaryId}`,
      selectionId,
      roundId,
      beneficiaryId,
      amount,
      status: 'pending',
      requiredApprovals,
      approvals: [],
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
  }

  /**
   * Add approval from reviewer
   */
  static addApproval(
    approval: DistributionApproval,
    approverId: string,
    approverName: string,
    approverRole: 'committee' | 'treasurer' | 'admin',
    decision: 'approved' | 'rejected',
    comments?: string
  ): DistributionApproval {
    // Check if already approved/rejected
    if (approval.status !== 'pending') {
      throw new Error('Approval is not in pending state');
    }

    // Check if already reviewed by this approver
    if (approval.approvals.some(a => a.approverId === approverId)) {
      throw new Error('This approver has already reviewed this approval');
    }

    if (decision === 'rejected') {
      approval.status = 'rejected';
      approval.rejectionReason = comments;
    } else {
      approval.approvals.push({
        approverId,
        approverName,
        approverRole,
        decision: 'approved',
        timestamp: new Date().toISOString(),
        comments,
      });

      // Check if all required approvals obtained
      if (approval.approvals.length >= approval.requiredApprovals) {
        approval.status = 'approved';
      }
    }

    return approval;
  }

  /**
   * Check if approval is expired
   */
  static isExpired(approval: DistributionApproval): boolean {
    return new Date() > new Date(approval.expiresAt);
  }

  /**
   * Get approval progress
   */
  static getApprovalProgress(approval: DistributionApproval): {
    approvalsReceived: number;
    approvalsRequired: number;
    percentComplete: number;
  } {
    return {
      approvalsReceived: approval.approvals.length,
      approvalsRequired: approval.requiredApprovals,
      percentComplete: (approval.approvals.length / approval.requiredApprovals) * 100,
    };
  }
}

// Mock Data Generator
export function generateMockGroupMembers(): GroupMember[] {
  const members: GroupMember[] = [
    {
      id: 'member_1',
      userId: 'user_1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543210',
      joinDate: '2025-01-15T00:00:00Z',
      totalContributions: 30000,
      timesReceived: 1,
      installmentsCompleted: 8,
      isActive: true,
      needScore: 45,
      lastReceivedDate: '2026-01-15T00:00:00Z',
    },
    {
      id: 'member_2',
      userId: 'user_2',
      name: 'Priya Singh',
      email: 'priya@example.com',
      phone: '9876543211',
      joinDate: '2025-02-01T00:00:00Z',
      totalContributions: 28000,
      timesReceived: 0,
      installmentsCompleted: 7,
      isActive: true,
      needScore: 62,
    },
    {
      id: 'member_3',
      userId: 'user_3',
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '9876543212',
      joinDate: '2025-01-20T00:00:00Z',
      totalContributions: 35000,
      timesReceived: 1,
      installmentsCompleted: 9,
      isActive: true,
      needScore: 38,
      lastReceivedDate: '2025-12-20T00:00:00Z',
    },
    {
      id: 'member_4',
      userId: 'user_4',
      name: 'Deepika Sharma',
      email: 'deepika@example.com',
      phone: '9876543213',
      joinDate: '2025-03-10T00:00:00Z',
      totalContributions: 25000,
      timesReceived: 0,
      installmentsCompleted: 5,
      isActive: true,
      needScore: 75,
    },
    {
      id: 'member_5',
      userId: 'user_5',
      name: 'Sanjay Gupta',
      email: 'sanjay@example.com',
      phone: '9876543214',
      joinDate: '2025-02-15T00:00:00Z',
      totalContributions: 32000,
      timesReceived: 0,
      installmentsCompleted: 8,
      isActive: true,
      needScore: 55,
    },
  ];

  return members;
}

export function generateMockRotationRound(): RotationRound {
  return {
    id: 'round_1',
    groupId: 'group_1',
    roundNumber: 3,
    startDate: '2026-02-15T00:00:00Z',
    expectedEndDate: '2026-03-15T00:00:00Z',
    status: 'pending',
    allocatedAmount: 300000,
    notes: 'Monthly rotation for February',
  };
}
