import { RestDays } from '@gscwd-api/utils';
import { IsArray, IsDateString, IsUUID } from 'class-validator';

export class CreateEmployeeRestDayDto {
  @IsUUID(4)
  employeeId: string;

  @IsDateString()
  dateFrom: Date;

  @IsDateString()
  dateTo: Date;

  @IsArray()
  restDays: RestDays[];
}
