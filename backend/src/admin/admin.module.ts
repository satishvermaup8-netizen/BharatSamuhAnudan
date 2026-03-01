import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { User } from '../users/entities/user.entity';
import { Group } from '../groups/entities/group.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Claim } from '../claims/entities/claim.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Group,
      Wallet,
      Payment,
      Claim,
    ]),
  ],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
  exports: [AdminDashboardService],
})
export class AdminModule {}
