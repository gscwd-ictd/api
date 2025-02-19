
import { IsUUID } from 'class-validator';
import { OvertimeApplication } from '../overtime-application';
import { PickType } from '@nestjs/swagger';

export class CreateOvertimeEmployeeDto {
  overtimeApplicationId: OvertimeApplication;

  @IsUUID()
  employeeId: string;
}

export class DeleteOvertimeEmployeeDto extends PickType(CreateOvertimeEmployeeDto, ['employeeId', 'overtimeApplicationId']) {
  @IsUUID()
  immediateSupervisorEmployeeId: string;
}