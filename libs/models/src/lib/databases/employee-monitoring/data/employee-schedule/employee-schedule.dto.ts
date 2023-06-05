import { CustomGroups, EmployeeSchedule, Schedule } from '@gscwd-api/models';
import { PickType } from '@nestjs/swagger';

export class CreateEmployeeScheduleDto {
  scheduleId: Schedule;
  employeeId: string;
  dateTo: Date;
  dateFrom: Date;
  restDays: Date[];
}

export class CreateEmployeeScheduleByGroupDto extends PickType(CreateEmployeeScheduleDto, ['dateFrom', 'dateTo', 'scheduleId']) {
  employee: { id: string; restDays: Date[] }[];
}
