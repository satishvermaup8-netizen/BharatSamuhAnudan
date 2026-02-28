import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({ required: false }) @IsString() @IsOptional() name?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() contributionAmount?: number;
  @ApiProperty({ enum: ['active', 'inactive', 'pending', 'completed'], required: false }) @IsEnum(['active', 'inactive', 'pending', 'completed']) @IsOptional() status?: string;
}
