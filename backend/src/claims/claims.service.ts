import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from './entities/claim.entity';
import { CreateClaimDto } from './dto/create-claim.dto';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  async findAll(): Promise<Claim[]> {
    return this.claimRepository.find();
  }

  async findOne(id: string): Promise<Claim> {
    const claim = await this.claimRepository.findOne({ where: { id } });
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }
    return claim;
  }

  async create(createClaimDto: CreateClaimDto): Promise<Claim> {
    const claim = this.claimRepository.create(createClaimDto);
    return this.claimRepository.save(claim);
  }
}
