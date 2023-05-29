import { RestDays } from '@gscwd-api/utils';

export class EmployeeRestDaysDto {
  employeeId: string;
  restDay: RestDays;
  dateFrom: Date;
  dateTo: Date;
}
