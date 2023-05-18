import { DailyTimeRecordPayload, DailyTimeRecordPayloadForSingleEmployee } from '@gscwd-api/utils';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Payload } from '@nestjs/microservices/decorators';
import { DailyTimeRecordService } from './daily-time-record.service';

@Controller('daily-time-record')
export class DailyTimeRecordController {
  constructor(private readonly dailyTimeRecordService: DailyTimeRecordService) {}

  @MessagePattern('get_all_records')
  async getAllRecords() {
    return await this.dailyTimeRecordService.getAllDTR();
  }

  @MessagePattern('get_dtr_by_company_id')
  async getDtrByCompanyId(@Payload() dtrPayload: DailyTimeRecordPayload) {
    return await this.dailyTimeRecordService.getDtrByCompanyId(dtrPayload);
  }

  @MessagePattern('get_dtr_by_company_id_and_date')
  async getEmployeeDtrByDayAndCompanyId(@Payload() dailyTimeRecordPayloadForSingleEmployee: DailyTimeRecordPayloadForSingleEmployee) {
    return await this.dailyTimeRecordService.getEmployeeDtrByDayAndCompanyId(dailyTimeRecordPayloadForSingleEmployee);
  }
}
