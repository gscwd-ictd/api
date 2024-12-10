import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report, LoginUser, User } from '@gscwd-api/utils';
import { stringify } from 'querystring';

@Controller({ version: '1', path: 'reports' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('')
  async generateReport(
    @Query('report') report: Report,
    @Query('month_year') monthYear: string,
    @Query('date_from') dateFrom: Date,
    @Query('date_to') dateTo: Date,
    @Query('employee_id') employeeId: string
    //@LoginUser() user: User
  ) {
    return await this.reportsService.generateReport(
      { employeeId: '42d5dcf9-60f2-11ee-96a6-005056b6c8f5', name: 'John Doe' },
      report,
      dateFrom,
      dateTo,
      monthYear,
      employeeId
    );
  }
}
