import { OvertimeStatus } from '@gscwd-api/utils';
import { OvertimeImmediateSupervisor } from '../overtime-immediate-supervisor';

export class CreateOvertimeApplicationDto {
  overtimeImmediateSupervisorId: OvertimeImmediateSupervisor;

  plannedDate: string;

  estimatedHours: number;

  purpose: string;

  status: OvertimeStatus;
}
