import { IsUUID } from 'class-validator';

export class CreateOvertimeImmediateSupervisorDto {
  @IsUUID()
  employeeId: string;

  @IsUUID()
  orgId: string;
}
