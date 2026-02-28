import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';

export enum GroupType {
  SAVINGS = 'savings',
  EMERGENCY = 'emergency',
  BUSINESS = 'business',
}

export class CreateGroupDto {
  @ApiProperty({ example: 'My Savings Group' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'A group for monthly savings', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Mumbai, Maharashtra' })
  @IsString()
  location: string;

  @ApiProperty({ example: 2500, description: 'Monthly contribution amount in INR' })
  @IsNumber()
  contributionAmount: number;

  @ApiProperty({ example: 'savings', enum: GroupType })
  @IsEnum(GroupType)
  groupType: GroupType;

  @ApiProperty({ example: 20, description: 'Maximum number of members' })
  @IsNumber()
  maxMembers: number;

  @ApiProperty({ example: 'uuid-of-leader', description: 'User ID of the group leader' })
  @IsUUID()
  leaderId: string;
}
