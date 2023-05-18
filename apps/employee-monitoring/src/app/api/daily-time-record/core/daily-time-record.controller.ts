import { DtrPayload } from '@gscwd-api/utils';
import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { DailyTimeRecordService } from './daily-time-record.service';

@Controller({ version: '1', path: 'daily-time-record' })
export class DailyTimeRecordController {
  constructor(private readonly dailyTimeRecordService: DailyTimeRecordService) {}

  @Get()
  async getAllRecords() {
    return await this.dailyTimeRecordService.getAllDTR();
  }

  @Get('/test/')
  async insertDtr(@Body() data: { companyId: string; date: Date }) {
    const { companyId, date } = data;
    const id = companyId.replace('-', '');
    return await this.dailyTimeRecordService.insertDtr({ companyId: id, date });
  }

  @Get(':company_id')
  async getDtrByCompanyId(@Param('company_id') companyId: string, @Query('date_from') dateFrom: Date, @Query('date_to') dateTo: Date) {
    const dtrPayload: DtrPayload = { dateFrom, dateTo };
    return await this.dailyTimeRecordService.getDtrByCompanyId(companyId, dtrPayload);
  }
}
