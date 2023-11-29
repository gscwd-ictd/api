import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report, LoginUser, User } from '@gscwd-api/utils';

@Controller({ version: '1', path: 'reports' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('')
  async generateReport(@Query('report') report: Report, @Query('date_from') dateFrom: Date, @Query('date_to') dateTo: Date, @LoginUser() user: User) {
    console.log(user);
    return await this.reportsService.generateReport(report, dateFrom, dateTo, user);
  }
}
