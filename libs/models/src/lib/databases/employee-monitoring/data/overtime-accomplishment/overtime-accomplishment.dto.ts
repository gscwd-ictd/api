import { OvertimeStatus } from '@gscwd-api/utils';
import { OmitType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { OvertimeApplication } from '../overtime-application';
import { OvertimeEmployee } from '../overtime-employee';

export class CreateOvertimeAccomplishmentDto {
  overtimeEmployeeId: OvertimeEmployee;

  @IsOptional()
  ivmsTimeIn?: number;

  @IsOptional()
  ivmsTimeOut?: number;

  @IsOptional()
  encodedTimeIn?: Date;

  @IsOptional()
  encodedTimeOut?: Date;

  @IsOptional()
  accomplishments?: string;

  @IsOptional()
  followEstimatedHrs?: boolean;

  @IsOptional()
  status?: OvertimeStatus;

  @IsOptional()
  remarks?: string;

  @IsOptional()
  actualHrs?: number;
}

export class UpdateOvertimeAccomplishmentDto extends OmitType(CreateOvertimeAccomplishmentDto, [
  'overtimeEmployeeId',
  'encodedTimeIn',
  'encodedTimeOut',
] as const) {
  employeeId: string;
  overtimeApplicationId: OvertimeApplication;
  approvedBy?: string;
}

export class UpdateAllOvertimeAccomplishmentDto extends OmitType(CreateOvertimeAccomplishmentDto, [
  'overtimeEmployeeId',
  'encodedTimeIn',
  'encodedTimeOut',
] as const) {
  employeeIds: string[];
  overtimeApplicationId: OvertimeApplication;
  approvedBy: string;
}

export class UpdateOvertimeAccomplishmentByEmployeeDto extends PickType(CreateOvertimeAccomplishmentDto, [
  'accomplishments',
  'encodedTimeIn',
  'encodedTimeOut',
]) {
  employeeId: string;
  overtimeApplicationId: string;
}
