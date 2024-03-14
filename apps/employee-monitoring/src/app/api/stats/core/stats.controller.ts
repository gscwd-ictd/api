import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller({ version: '1', path: 'stats' })
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get(':employee_id')
  async countAllPendingApplicationsForManager(@Param('employee_id') employeeId: string) {
    return await this.statsService.countAllPendingApplicationsForManager(employeeId);
  }

  @Get('lates/department')
  async getLatesPerDepartment() {
    return await this.statsService.getLatesPerDepartment();
  }
}
