import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';

@ApiTags('Claims')
@Controller('claims')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all claims' })
  findAll() { return this.claimsService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get claim by ID' })
  findOne(@Param('id') id: string) { return this.claimsService.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Create new claim' })
  create(@Body() createClaimDto: CreateClaimDto) { return this.claimsService.create(createClaimDto); }
}
