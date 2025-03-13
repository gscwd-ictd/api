import { IsUUID } from 'class-validator';
import { OvertimeApplication } from '../overtime-application';
import { PickType } from '@nestjs/swagger';

export class CreateOvertimeEmployeeDto {
  overtimeApplicationId: OvertimeApplication;

  @IsUUID()
  employeeId: string;
}

export class DeleteOvertimeEmployeeByImmediateSupervisorDto extends PickType(CreateOvertimeEmployeeDto, ['employeeId', 'overtimeApplicationId']) {
  @IsUUID()
  immediateSupervisorEmployeeId: string;
}

export class DeleteOvertimeEmployeeByManagerDto extends PickType(CreateOvertimeEmployeeDto, ['employeeId', 'overtimeApplicationId']) {
  @IsUUID()
  managerId: string;
}