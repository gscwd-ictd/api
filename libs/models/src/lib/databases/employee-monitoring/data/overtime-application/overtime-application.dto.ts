import { OvertimeStatus } from '@gscwd-api/utils';
import { PartialType, PickType } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
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
]) {
  employees: string[];
}

//export class
