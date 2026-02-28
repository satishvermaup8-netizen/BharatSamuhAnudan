import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'My Savings Group' }) @IsString() name: string;
  @ApiProperty({ example: 'A group for monthly savings', required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty({ example: 1000 }) @IsNumber() contributionAmount: number;
}
