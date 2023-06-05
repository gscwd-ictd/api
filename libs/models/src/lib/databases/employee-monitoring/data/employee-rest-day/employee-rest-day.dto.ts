import { RestDays } from '@gscwd-api/utils';

export class CreateEmployeeRestDayDto {
  employeeId: string;
  dateFrom: Date;
  dateTo: Date;
  restDays: Date[];
}
