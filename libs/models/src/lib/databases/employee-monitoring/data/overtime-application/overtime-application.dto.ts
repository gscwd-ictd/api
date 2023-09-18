import { OvertimeStatus } from '@gscwd-api/utils';
import { PickType } from '@nestjs/swagger';
import { CreateOvertimeEmployeeDto } from '../overtime-employee';
import { OvertimeImmediateSupervisor } from '../overtime-immediate-supervisor';

export class CreateOvertimeApplicationDto {
  overtimeImmediateSupervisorId?: OvertimeImmediateSupervisor;
  managerId?: string;
  plannedDate: Date;
  estimatedHours: number;
  purpose: string;
  status?: OvertimeStatus;
}

export class CreateOvertimeDto extends PickType(CreateOvertimeApplicationDto, [
  'estimatedHours',
  'overtimeImmediateSupervisorId',
  'plannedDate',
  'purpose',
  'status',
]) {
  employees: string[];
}
