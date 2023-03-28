import { ScheduleType, ScheduleShift, ScheduleBase } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { ScheduleRestDayDto } from '../schedule-rest-day/schedule-rest-day.dto';

export class CreateScheduleDto {
  name: string;
  scheduleType: ScheduleType;
  scheduleBase: ScheduleBase;
  timeIn: string;
  timeOut: string;
  lunchIn: string;
  lunchOut: string;
  shift: ScheduleShift;
  restDays: number[];
}

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  id: string;
}
