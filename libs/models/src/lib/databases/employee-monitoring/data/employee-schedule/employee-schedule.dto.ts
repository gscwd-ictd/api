import { CustomGroups, EmployeeSchedule, Schedule } from '@gscwd-api/models';
import { RestDays } from '@gscwd-api/utils';
import { PickType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateEmployeeScheduleDto {
  scheduleId: Schedule;

  @IsUUID(4)
  employeeId: string;

  @IsOptional()
  @IsDateString()
  dateTo?: Date;

  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @IsOptional()
  customGroupId?: CustomGroups;

  @IsArray()
  restDays: RestDays[];
}

export class CreateEmployeeScheduleByGroupDto extends PickType(CreateEmployeeScheduleDto, ['dateFrom', 'dateTo', 'scheduleId']) {
  @IsOptional()
  customGroupId?: CustomGroups;

  @IsArray({ each: true })
  employees: { employeeId: string; restDays: RestDays[] }[];
}

export class DeleteEmployeeScheduleDto extends PickType(CreateEmployeeScheduleDto, ['dateFrom', 'dateTo', 'employeeId']) {}
