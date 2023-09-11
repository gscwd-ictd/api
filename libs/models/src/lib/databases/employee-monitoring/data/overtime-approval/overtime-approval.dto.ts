import { OvertimeApplication } from '@gscwd-api/models';
import { IsOptional } from 'class-validator';

export class CreateOvertimeApprovalDto {
  overtimeApplicationId: OvertimeApplication;

  @IsOptional()
  dateApproved?: Date;

  @IsOptional()
  managerId?: string;

  @IsOptional()
  remarks?: string;
}
