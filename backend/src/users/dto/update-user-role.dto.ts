import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'User role',
    enum: ['member', 'group_admin', 'support_admin', 'finance_admin', 'super_admin'],
    example: 'member',
  })
  @IsEnum(['member', 'group_admin', 'support_admin', 'finance_admin', 'super_admin'])
  role: string;

  @ApiProperty({
    description: 'Reason for role change',
    required: false,
    example: 'Promoted to group administrator',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
