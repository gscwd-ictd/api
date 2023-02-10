import { ScheduleType, ScheduleShift } from '@gscwd-api/utils';
import { ScheduleRestDayDto } from '../schedule-rest-day/schedule-rest-day.dto';

export class ScheduleDto {
  name: string;
  scheduleType: ScheduleType;
  timeIn: string;
  timeOut: string;
  lunchIn: string;
  lunchOut: string;
  shift: ScheduleShift;
  restDays: ScheduleRestDayDto[];
}
