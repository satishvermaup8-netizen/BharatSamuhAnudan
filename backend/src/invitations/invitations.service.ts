import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Invitation, InvitationStatus, InviteMethod } from './entities/invitation.entity';
import { CreateInvitationDto, RespondToInvitationDto } from './dto/create-invitation.dto';

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);
  private invitations: Invitation[] = [];

  async createInvitation(
    inviterId: string,
    inviterName: string,
    dto: CreateInvitationDto,
  ): Promise<Invitation> {
    // Validate invite value based on method
    if (dto.inviteMethod === InviteMethod.MOBILE && !/^\d{10}$/.test(dto.inviteValue)) {
      throw new BadRequestException('Invalid mobile number. Must be 10 digits.');
    }

    // Check if invitation already exists for this user and group
    const existing = this.invitations.find(
      (inv) =>
        inv.groupId === dto.groupId &&
        inv.inviteMethod === dto.inviteMethod &&
        inv.inviteValue === dto.inviteValue &&
        inv.status === InvitationStatus.PENDING,
    );

    if (existing) {
      throw new BadRequestException('Invitation already sent to this user for this group.');
    }

    const invitation: Invitation = {
      id: uuidv4(),
      groupId: dto.groupId,
      groupName: 'Group Name', // Would fetch from group service
      invitedBy: inviterId,
      invitedByName: inviterName,
      inviteMethod: dto.inviteMethod,
      inviteValue: dto.inviteValue,
      message: dto.message,
      status: InvitationStatus.PENDING,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    this.invitations.push(invitation);
    this.logger.log(`Invitation created: ${invitation.id} for group ${dto.groupId}`);

    // TODO: Send notification to user
    await this.sendNotification(invitation);

    return invitation;
  }

  private async sendNotification(invitation: Invitation): Promise<void> {
    // Mock notification sending
    this.logger.log(`Sending notification to ${invitation.inviteValue} via ${invitation.inviteMethod}`);
    // In production, integrate with SMS, email, or push notification services
  }

  async respondToInvitation(
    userId: string,
    dto: RespondToInvitationDto,
  ): Promise<Invitation> {
    const invitation = this.invitations.find((inv) => inv.id === dto.invitationId);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException(`Invitation already ${invitation.status}`);
    }

    if (new Date() > invitation.expiresAt) {
      invitation.status = InvitationStatus.EXPIRED;
      throw new BadRequestException('Invitation has expired');
    }

    invitation.status =
      dto.response === 'accept' ? InvitationStatus.ACCEPTED : InvitationStatus.REJECTED;
    invitation.respondedAt = new Date();
    invitation.inviteeUserId = userId;

    this.logger.log(`Invitation ${invitation.id} ${dto.response}ed by user ${userId}`);

    return invitation;
  }

  async getUserInvitations(userId: string): Promise<Invitation[]> {
    return this.invitations.filter(
      (inv) => inv.inviteeUserId === userId || inv.status === InvitationStatus.PENDING,
    );
  }

  async getPendingInvitationsByMobile(mobile: string): Promise<Invitation[]> {
    return this.invitations.filter(
      (inv) =>
        inv.inviteMethod === InviteMethod.MOBILE &&
        inv.inviteValue === mobile &&
        inv.status === InvitationStatus.PENDING,
    );
  }

  async getGroupInvitations(groupId: string): Promise<Invitation[]> {
    return this.invitations.filter((inv) => inv.groupId === groupId);
  }

  async cancelInvitation(inviterId: string, invitationId: string): Promise<void> {
    const invitation = this.invitations.find((inv) => inv.id === invitationId);

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.invitedBy !== inviterId) {
      throw new BadRequestException('Only the inviter can cancel this invitation');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Can only cancel pending invitations');
    }

    this.invitations = this.invitations.filter((inv) => inv.id !== invitationId);
    this.logger.log(`Invitation ${invitationId} cancelled by user ${inviterId}`);
  }
}
