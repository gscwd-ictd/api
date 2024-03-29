import { UpdateDailyTimeRecordDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { DailyTimeRecordService } from './daily-time-record.service';

@Controller({ version: '1', path: 'daily-time-record' })
export class DailyTimeRecordController {
  constructor(private readonly dailyTimeRecordService: DailyTimeRecordService) {}

  @Get()
  async getAllRecords() {
    return await this.dailyTimeRecordService.getAllDTR();
  }

  @Get('/employees/:company_id/:year/:month')
  async getEmployeeDtrByMonthAndYear(@Param('company_id') companyId: string, @Param('year') year: number, @Param('month') month: number) {
    return await this.dailyTimeRecordService.getEmployeeDtrByMonthAndYear(companyId, year, month);
  }

  @Get('/employees/:company_id/:date')
  async getDtrByCompanyIdAndDay(@Param('company_id') companyId: string, @Param('date') date: Date) {
    return await this.dailyTimeRecordService.getDtrByCompanyIdAndDay({ companyId, date });
  }

  @Patch()
  async updateEmployeeDTR(@Body() dailyTimeRecordDto: UpdateDailyTimeRecordDto) {
    return await this.dailyTimeRecordService.updateEmployeeDTR(dailyTimeRecordDto);
  }

  @Get('testing')
  async getEmployeeIds() {
    return await this.dailyTimeRecordService.addDTRToLedger();
  }
}
