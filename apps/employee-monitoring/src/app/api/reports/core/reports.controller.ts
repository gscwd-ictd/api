import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller({ version: '1', path: 'reports' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('report-on-attendance')
  async generateReportOnAttendance(@Query('date_from') dateFrom: Date, @Query('date_to') dateTo: Date) {
    return await this.reportsService.generateReportOnAttendance(dateFrom, dateTo);
  }
}
