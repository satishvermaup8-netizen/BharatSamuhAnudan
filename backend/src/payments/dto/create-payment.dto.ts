import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'user-uuid' }) @IsString() userId: string;
  @ApiProperty({ example: 'group-uuid' }) @IsString() groupId: string;
  @ApiProperty({ example: 1000 }) @IsNumber() amount: number;
  @ApiProperty({ required: false }) @IsString() @IsOptional() razorpayOrderId?: string;
}
