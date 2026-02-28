import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto, RespondToInvitationDto } from './dto/create-invitation.dto';

@ApiTags('Invitations')
@Controller('invitations')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @ApiOperation({ summary: 'Invite a user to join a group' })
  async createInvitation(
    @Body() dto: CreateInvitationDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.userId;
    const userName = (req.user as any)?.email || 'User';
    return this.invitationsService.createInvitation(userId, userName, dto);
  }

  @Post('respond')
  @ApiOperation({ summary: 'Accept or reject an invitation' })
  async respondToInvitation(
    @Body() dto: RespondToInvitationDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.userId;
    return this.invitationsService.respondToInvitation(userId, dto);
  }

  @Get('my-invitations')
  @ApiOperation({ summary: 'Get all invitations for current user' })
  async getMyInvitations(@Req() req: Request) {
    const userId = (req.user as any)?.userId;
    return this.invitationsService.getUserInvitations(userId);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all invitations for a group' })
  async getGroupInvitations(@Param('groupId') groupId: string) {
    return this.invitationsService.getGroupInvitations(groupId);
  }

  @Get('pending/:mobile')
  @ApiOperation({ summary: 'Get pending invitations by mobile number' })
  async getPendingByMobile(@Param('mobile') mobile: string) {
    return this.invitationsService.getPendingInvitationsByMobile(mobile);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel an invitation' })
  async cancelInvitation(
    @Param('id') invitationId: string,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)?.userId;
    return this.invitationsService.cancelInvitation(userId, invitationId);
  }
}
