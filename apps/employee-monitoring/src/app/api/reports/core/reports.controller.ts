import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report, LoginUser, User, NatureOfBusiness } from '@gscwd-api/utils';


@Controller({ version: '1', path: 'reports' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('')
  async generateReport(
    @Query('report') report: Report,
    @Query('month_year') monthYear: string,
    @Query('date_from') dateFrom: Date,
    @Query('date_to') dateTo: Date,
    @Query('employee_id') employeeId: string,
    @Query('pass_slip') natureOfBusiness: NatureOfBusiness,
    @LoginUser() user: User
  ) {
    return await this.reportsService.generateReport(
      user,
      report,
      dateFrom,
      dateTo,
      monthYear,
      employeeId,
      natureOfBusiness
    );
  }
}
