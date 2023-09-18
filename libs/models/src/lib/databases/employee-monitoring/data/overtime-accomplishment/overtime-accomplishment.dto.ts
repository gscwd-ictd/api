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
  encodedTimeIn?: number;

  @IsOptional()
  encodedTimeOut?: number;

  @IsOptional()
  accomplishments?: string;

  @IsOptional()
  followEstimatedHrs?: boolean;

  status: OvertimeStatus;
}

export class UpdateOvertimeAccomplishmentDto extends OmitType(CreateOvertimeAccomplishmentDto, ['overtimeEmployeeId']) {
  employeeId: string;
  overtimeApplicationId: OvertimeApplication;
}
