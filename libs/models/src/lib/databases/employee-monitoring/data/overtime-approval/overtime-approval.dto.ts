import { OvertimeApplication } from '@gscwd-api/models';
import { OvertimeStatus } from '@gscwd-api/utils';
import { OmitType } from '@nestjs/swagger';
import { IsDateString, IsNotEmptyObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOvertimeApprovalDto {
  overtimeApplicationId: OvertimeApplication;

  @IsOptional()
  @IsDateString()
  dateApproved?: Date;

  @IsOptional()
  @IsUUID(4)
  managerId?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateOvertimeApprovalDto extends OmitType(CreateOvertimeApprovalDto, ['overtimeApplicationId', 'dateApproved']) {
  id: string;
  overtimeApplicationId: string;
  status: OvertimeStatus;
}
