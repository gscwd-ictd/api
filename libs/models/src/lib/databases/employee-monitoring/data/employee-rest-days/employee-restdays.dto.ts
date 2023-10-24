import { RestDays } from '@gscwd-api/utils';
import { IsArray } from 'class-validator';
import { EmployeeRestDay } from '../employee-rest-day/employee-rest-day.entity';

export class CreateEmployeeRestDaysDto {
  employeeRestDay: EmployeeRestDay;

  @IsArray()
  restDays: RestDays[];
}
