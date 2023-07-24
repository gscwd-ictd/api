import { PartialType, PickType } from '@nestjs/swagger';
import { Schedule } from '../schedule/schedule.entity';

export class DailyTimeRecordDto {
  companyId: string;
  dtrDate: Date;
  timeIn: Date;
  lunchOut: Date;
  lunchIn: Date;
  timeOut: Date;
  scheduleId: Schedule;
}

export class UpdateDailyTimeRecordDto extends PickType(DailyTimeRecordDto, ['companyId', 'dtrDate']) {
  timeIn?: number;
  lunchOut?: number;
  lunchIn?: number;
  timeOut?: number;
}
