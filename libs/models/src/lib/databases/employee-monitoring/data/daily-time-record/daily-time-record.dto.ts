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
