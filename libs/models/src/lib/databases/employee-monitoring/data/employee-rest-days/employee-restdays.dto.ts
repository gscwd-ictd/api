import { RestDays } from '@gscwd-api/utils';
import { EmployeeRestDay } from '../employee-rest-day/employee-rest-day.entity';

export class CreateEmployeeRestDaysDto {
  employeeRestDay: EmployeeRestDay;
  restDays: RestDays[];
}
