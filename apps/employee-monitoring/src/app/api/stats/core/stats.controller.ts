import { Controller, Get, Param, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChartFilter, ChartsService } from './charts.service';
import { StatsService } from './stats.service';
import dayjs = require('dayjs');
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller({ version: '1', path: 'stats' })
export class StatsController {
  constructor(private readonly statsService: StatsService, private readonly chartsService: ChartsService) {}

  // Charts page: ?level=office|department|division&year=YYYY
  @Get('charts/:type')
  async getChartCounts(@Param('type') type: string, @Query() filter: ChartFilter) {
    return await this.chartsService.getCounts(type, filter);
  }

  // Charts page modals / top tables: same filters plus optional &orgId=&category=
  @Get('charts/:type/employees')
  async getChartEmployees(@Param('type') type: string, @Query() filter: ChartFilter) {
    return await this.chartsService.getEmployees(type, filter);
  }
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
