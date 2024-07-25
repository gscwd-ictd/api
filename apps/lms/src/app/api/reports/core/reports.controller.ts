import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { LoginUser, User } from '@gscwd-api/utils';

@Controller({ version: '1', path: 'reports' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /* find all training logs */
  @Get('trainings/logs/:dateRange')
  async findTrainingLogs(@Param('dateRange') dateRange: string) {
    return await this.reportsService.findTrainingLog(dateRange);
  }

  @Get('signatories')
  async signatories(@LoginUser() user: User) {
    return await this.reportsService.trainingSignatories(user.employeeId);
  }
}
