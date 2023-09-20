import { OvertimeApplication } from '@gscwd-api/models';
import { OvertimeStatus } from '@gscwd-api/utils';
import { OmitType } from '@nestjs/swagger';
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

export class UpdateOvertimeApprovalDto extends OmitType(CreateOvertimeApprovalDto, ['overtimeApplicationId', 'dateApproved']) {
  id: string;
  overtimeApplicationId: string;
  status: OvertimeStatus;
}
