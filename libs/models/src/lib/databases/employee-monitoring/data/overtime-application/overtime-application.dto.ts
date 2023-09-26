import { OvertimeStatus } from '@gscwd-api/utils';
import { PartialType, PickType } from '@nestjs/swagger';
import { OvertimeImmediateSupervisor } from '../overtime-immediate-supervisor';

export class CreateOvertimeApplicationDto {
  overtimeImmediateSupervisorId?: OvertimeImmediateSupervisor;
  managerId?: string;
  plannedDate: Date;
  estimatedHours: number;
  purpose: string;
  status?: OvertimeStatus;
}

export class ApproveOvertimeApplicationDto extends PartialType(CreateOvertimeApplicationDto) {}

export class CreateOvertimeDto extends PickType(CreateOvertimeApplicationDto, [
  'estimatedHours',
  'overtimeImmediateSupervisorId',
  'plannedDate',
  'purpose',
  'status',
]) {
  employees: string[];
}

//export class
