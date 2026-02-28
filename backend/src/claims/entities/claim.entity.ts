import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('claims')
export class Claim {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column() groupId: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) amount: number;
  @Column({ type: 'enum', enum: ['submitted', 'under_review', 'approved', 'rejected', 'paid'], default: 'submitted' }) status: string;
  @Column({ nullable: true }) documentUrl: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
