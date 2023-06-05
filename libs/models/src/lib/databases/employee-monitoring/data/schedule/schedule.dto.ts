import { ScheduleType, ScheduleShift, ScheduleBase } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';

export class CreateScheduleDto {
  name: string;
  scheduleType: ScheduleType;
  scheduleBase: ScheduleBase;
  timeIn: string;
  timeOut: string;
  lunchIn: string;
  lunchOut: string;
  shift: ScheduleShift;
  withLunch: boolean;
}

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  id: string;
}
