import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

export enum InviteMethod {
  MOBILE = 'mobile',
  USER_ID = 'user_id',
  EMAIL = 'email',
}

export class CreateInvitationDto {
  @ApiProperty({ example: 'group-uuid', description: 'Group ID to invite user to' })
  @IsUUID()
  groupId: string;

  @ApiProperty({ example: 'mobile', enum: InviteMethod, description: 'Method used to identify the invitee' })
  @IsEnum(InviteMethod)
  inviteMethod: InviteMethod;

  @ApiProperty({ example: '9876543210', description: 'Mobile number, user ID, or email based on inviteMethod' })
  @IsString()
  inviteValue: string;

  @ApiProperty({ example: 'Please join our savings group!', required: false })
  @IsString()
  @IsOptional()
  message?: string;
}

export class RespondToInvitationDto {
  @ApiProperty({ example: 'invitation-uuid' })
  @IsUUID()
  invitationId: string;

  @ApiProperty({ example: 'accept', enum: ['accept', 'reject'] })
  @IsEnum(['accept', 'reject'])
  response: 'accept' | 'reject';
}
