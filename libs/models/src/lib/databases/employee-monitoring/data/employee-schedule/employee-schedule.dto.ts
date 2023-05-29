import { Schedule } from '@gscwd-api/models';
import { RestDays } from '@gscwd-api/utils';

export class EmployeeScheduleDto {
  scheduleId: Schedule;
  employeeId: string;
  dateTo: Date;
  dateFrom: Date;
  restDays: RestDays[];
}
