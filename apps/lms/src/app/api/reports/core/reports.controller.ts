import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller({ version: '1', path: 'reports' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /* find all training logs */
  @Get('trainings/logs/:dateRange')
  async findTrainingLogs(@Param('dateRange') dateRange: string) {
    return await this.reportsService.findTrainingLog(dateRange);
  }

  @Get('signatories')
  async signatories() {
    return await this.reportsService.trainingSignatories();
  }
}
