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
  remarks?: string;
}

export class UpdateDailyTimeRecordDto extends PickType(DailyTimeRecordDto, ['companyId', 'dtrDate']) {
  timeIn?: number;
  lunchOut?: number;
  lunchIn?: number;
  timeOut?: number;
  remarks: string;
}

export class CreateDtrRemarksDto extends PickType(DailyTimeRecordDto, ['companyId']) {
  companyId: string;
  dtrDates: Date[];
  remarks: string;
}

export class UpdateDtrRemarksDto {
  dtrId: string;
  remarks: string;
}
