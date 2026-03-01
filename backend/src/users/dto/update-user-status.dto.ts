import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'User status',
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    example: 'active',
  })
  @IsEnum(['active', 'inactive', 'suspended', 'pending_verification'])
  status: string;

  @ApiProperty({
    description: 'Reason for status change',
    required: false,
    example: 'User violated terms of service',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
