import { CreateDtrRemarksDto, UpdateDailyTimeRecordDto, UpdateDtrRemarksDto } from '@gscwd-api/models';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DailyTimeRecordService } from './daily-time-record.service';

@Controller({ version: '1', path: 'daily-time-record' })
export class DailyTimeRecordController {
  constructor(private readonly dailyTimeRecordService: DailyTimeRecordService) { }

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

  @Get('/employees/entries/logs/:company_id/:date_now')
  async getEntriesTheDayAndTheNext(@Param('company_id') companyId: string, @Param('date_now') date: Date) {
    return await this.dailyTimeRecordService.getEntriesTheDayAndTheNext({ companyId, date });
  }

  @Post('remarks')
  async addDtrRemarksPerEmployee(@Body() createDtrRemarksDto: CreateDtrRemarksDto) {
    return await this.dailyTimeRecordService.addDtrRemarksPerEmployee(createDtrRemarksDto);
  }

  @Patch('remarks')
  async updateDtrRemarksPerEmployeePerDay(@Body() updateDtrRemarksDto: UpdateDtrRemarksDto) {
    return await this.dailyTimeRecordService.updateDtrRemarksPerEmployeePerDay(updateDtrRemarksDto);
  }
}
