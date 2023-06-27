import { CustomGroups, EmployeeSchedule, Schedule } from '@gscwd-api/models';
import { RestDays } from '@gscwd-api/utils';
import { PickType } from '@nestjs/swagger';

export class CreateEmployeeScheduleDto {
  scheduleId: Schedule;
  employeeId: string;
  dateTo?: Date;
  dateFrom?: Date;
  restDays: RestDays[];
}

export class CreateEmployeeScheduleByGroupDto extends PickType(CreateEmployeeScheduleDto, ['dateFrom', 'dateTo', 'scheduleId']) {
  employees: { employeeId: string; restDays: RestDays[] }[];
}

export class DeleteEmployeeScheduleDto extends PickType(CreateEmployeeScheduleDto, ['dateFrom', 'dateTo', 'employeeId']) {}
