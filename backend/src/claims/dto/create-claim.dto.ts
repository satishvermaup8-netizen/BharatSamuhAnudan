import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateClaimDto {
  @ApiProperty({ example: 'user-uuid' }) @IsString() userId: string;
  @ApiProperty({ example: 'group-uuid' }) @IsString() groupId: string;
  @ApiProperty({ example: 50000 }) @IsNumber() amount: number;
  @ApiProperty({ required: false }) @IsString() @IsOptional() documentUrl?: string;
}
