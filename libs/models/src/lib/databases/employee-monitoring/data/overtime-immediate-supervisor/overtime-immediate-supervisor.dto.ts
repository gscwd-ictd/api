import { IsUUID } from 'class-validator';

export class CreateOvertimeImmediateSupervisorDto {
  @IsUUID(4)
  employeeId: string;

  @IsUUID(4)
  orgId: string;
}
