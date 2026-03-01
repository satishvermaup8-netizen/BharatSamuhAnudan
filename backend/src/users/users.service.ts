import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(filters?: { role?: string; status?: string; kycStatus?: string; search?: string }): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filters?.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters?.status) {
      queryBuilder.andWhere('user.status = :status', { status: filters.status });
    }

    if (filters?.kycStatus) {
      queryBuilder.andWhere('user.kyc_status = :kycStatus', { kycStatus: filters.kycStatus });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(user.username LIKE :search OR user.email LIKE :search OR user.mobile LIKE :search OR user.full_name LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: string): Promise<User> {
    const user = await this.findOne(id);
    user.status = status;
    return this.userRepository.save(user);
  }

  async updateRole(id: string, role: string): Promise<User> {
    const user = await this.findOne(id);
    user.role = role;
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Get detailed user information with related data
  async getUserDetails(id: string): Promise<any> {
    const user = await this.findOne(id);
    
    // Fetch related data - these would be actual database queries in production
    const wallet = await this.getUserWallet(id);
    const groups = await this.getUserGroups(id);
    const nominees = await this.getUserNominees(id);
    const contributions = await this.getUserContributions(id);

    return {
      ...user,
      wallet,
      groups,
      nominees,
      contributions,
    };
  }

  async getUserWallet(id: string): Promise<any> {
    // TODO: Implement actual database query to wallets table
    // This should fetch from the wallets service/repository
    return {
      balance: 0,
      currency: 'INR',
      userId: id,
    };
  }

  async getUserGroups(id: string): Promise<any[]> {
    // TODO: Implement actual database query to group_members table
    // This should join with groups table to get full group details
    return [];
  }

  async getUserNominees(id: string): Promise<any[]> {
    // TODO: Implement actual database query to nominees table
    // This should fetch all nominees associated with the user
    return [];
  }

  async getUserContributions(id: string): Promise<any[]> {
    // TODO: Implement actual database query to payments/contributions table
    // This should fetch payment history for the user
    return [];
  }

  async exportUserData(id: string): Promise<any> {
    const user = await this.getUserDetails(id);
    return {
      user,
      exportedAt: new Date().toISOString(),
      format: 'json',
    };
  }

  async exportAllUsers(filters?: { role?: string; status?: string; kycStatus?: string }): Promise<any> {
    const users = await this.findAll(filters);
    return {
      users,
      totalCount: users.length,
      exportedAt: new Date().toISOString(),
      format: 'json',
      filters,
    };
  }
}
