export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum InviteMethod {
  MOBILE = 'mobile',
  USER_ID = 'user_id',
  EMAIL = 'email',
}

export interface Invitation {
  id: string;
  groupId: string;
  groupName: string;
  invitedBy: string;
  invitedByName: string;
  inviteMethod: InviteMethod;
  inviteValue: string;
  inviteeUserId?: string;
  message?: string;
  status: InvitationStatus;
  createdAt: Date;
  expiresAt: Date;
  respondedAt?: Date;
}
