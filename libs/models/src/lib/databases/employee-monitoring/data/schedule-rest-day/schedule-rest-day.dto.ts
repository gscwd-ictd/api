import { RestDays } from '@gscwd-api/utils';
import { Schedule } from '../schedule/schedule.entity';

export class ScheduleRestDayDto {
  scheduleId: Schedule;
  restDay: RestDays;
}
