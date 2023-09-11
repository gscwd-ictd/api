import { OvertimeStatus } from '@gscwd-api/utils';
import { PickType } from '@nestjs/swagger';
import { CreateOvertimeEmployeeDto } from '../overtime-employee';
import { OvertimeImmediateSupervisor } from '../overtime-immediate-supervisor';

export class CreateOvertimeApplicationDto {
  overtimeImmediateSupervisorId: OvertimeImmediateSupervisor;
  plannedDate: Date;
  estimatedHours: number;
  purpose: string;
  status?: OvertimeStatus;
}

export class CreateOvertimeDto {
  overtimeApplication: CreateOvertimeApplicationDto;
  employees: string[];
}
