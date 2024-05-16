import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { StatsService } from './stats.service';
import dayjs = require('dayjs');
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AuthenticatedGuard } from '../../users/guards/authenticated.guard';

@Controller({ version: '1', path: 'stats' })
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  //@UseGuards(AuthenticatedGuard)

  @Get(':employee_id')
  async countAllPendingApplicationsForManager(@Param('employee_id') employeeId: string) {
    return await this.statsService.countAllPendingApplicationsForManager(employeeId);
  }

  @Get('hrmo/dashboard')
  async getDashBoardCount() {
    return await this.statsService.getDashBoardCount();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('lates/department')
  async getLatesPerDepartment() {
    return await this.statsService.getLatesPerDepartment();
  }
}
