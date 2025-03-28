import { OvertimeStatus } from '@gscwd-api/utils';
import { PartialType, PickType } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { OvertimeImmediateSupervisor } from '../overtime-immediate-supervisor';

export class CreateOvertimeApplicationDto {
  overtimeImmediateSupervisorId?: OvertimeImmediateSupervisor;

  @IsOptional()
  managerId?: string;

  @IsDate()
  plannedDate: Date;

  @IsNumber()
  estimatedHours: number;

  @IsString({ message: 'Please provide purpose.' })
  purpose: string;

  @IsOptional()
  @IsEnum(OvertimeStatus, { message: 'Please provide proper overtime status' })
  status?: OvertimeStatus;
}

export class ApproveOvertimeApplicationDto extends PartialType(CreateOvertimeApplicationDto) {}

export class CreateOvertimeDto extends PickType(CreateOvertimeApplicationDto, [
  'estimatedHours',
  'overtimeImmediateSupervisorId',
  'plannedDate',
  'purpose',
  'status',
  'managerId',
]) {
  employeeId: string;
  employees: string[];
}

export class UpdateOvertimeApplicationDto extends PickType(CreateOvertimeApplicationDto, ['estimatedHours', 'plannedDate', 'purpose']) {
  @IsUUID()
  id: string;

  @IsUUID()
  employeeId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  employees: string[];
}
