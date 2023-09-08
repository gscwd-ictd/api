import { OvertimeStatus } from '@gscwd-api/utils';
import { IsOptional } from 'class-validator';
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
