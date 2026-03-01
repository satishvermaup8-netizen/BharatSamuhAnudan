import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true, name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: ['member', 'group_admin', 'support_admin', 'finance_admin', 'super_admin'],
    default: 'member',
  })
  role: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    default: 'active',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'verified', 'rejected', 'under_review'],
    default: 'pending',
    name: 'kyc_status',
  })
  kycStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
