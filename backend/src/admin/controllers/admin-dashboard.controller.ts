import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import {
  DashboardStatsDto,
  PendingApprovalsDto,
  RealTimeStatsDto,
} from '../dto/admin-dashboard.dto';

@Controller('api/admin/dashboard')
@UseGuards(AuthGuard('jwt'))
export class AdminDashboardController {
  constructor(
    private readonly dashboardService: AdminDashboardService,
  ) {}

  @Get('stats')
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return this.dashboardService.getDashboardStats();
  }

  @Get('pending')
  async getPendingApprovals(): Promise<PendingApprovalsDto> {
    return this.dashboardService.getPendingApprovals();
  }

  @Get('realtime')
  async getRealTimeStats(): Promise<RealTimeStatsDto> {
    return this.dashboardService.getRealTimeStats();
  }

  @Get('growth')
  async getGrowthMetrics() {
    return this.dashboardService.getGrowthMetrics();
  }
}
