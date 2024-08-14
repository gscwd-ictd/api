import { LeaveApplicationStatus } from '@gscwd-api/utils';
import { PartialType, PickType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDate, IsDateString, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { LeaveBenefits } from '../leave-benefits/leave-benefits.entity';
import { CreateLeaveMonetizationDto } from '../leave-monetization';

export class CreateLeaveApplicationDto {
  @IsUUID(4, { message: 'Invalid Leave benefits UUID value.' })
  leaveBenefitId: LeaveBenefits;

  @IsUUID(4, { message: 'Invalid employeeId value.' })
  employeeId: string;

  @IsUUID(4, { message: 'Invalid supervisorId value.' })
  supervisorId: string;

  @IsDate({ message: 'Invalid Date of Filing' })
  dateOfFiling?: Date;

  @IsOptional()
  @IsString({ message: 'Specify place if travel is in Philippines' })
  inPhilippines?: string;

  @IsOptional()
  @IsString({ message: 'Specify place if travel is abroad' })
  abroad?: string;

  @IsOptional()
  @IsString({ message: 'specify illness if admitted' })
  inHospital?: string;

  @IsOptional()
  @IsString({ message: 'specify illness if out patient' })
  outPatient?: string;

  @IsOptional()
  @IsString({ message: 'specify in case of leave benefits for women.' })
  splWomen?: string;

  @IsOptional()
  @IsBoolean({ message: 'For bar board review value must only be true of false' })
  forMastersCompletion?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'For bar board review value must only be true of false' })
  forBarBoardReview?: boolean;

  @IsOptional()
  @IsString({ message: 'Specify other study leave details.' })
  studyLeaveOther?: string;

  @IsOptional()
  @IsBoolean({ message: 'forMonetization value must only be true of false' })
  forMonetization: boolean;

  @IsOptional()
  @IsBoolean({ message: ' isTerminalLeave value must only be true of false' })
  isTerminalLeave: boolean;

  @IsOptional()
  @IsBoolean({ message: 'requestedCommutation value must only be true of false' })
  requestedCommutation: boolean;

  @IsEnum(LeaveApplicationStatus, { message: 'Invalid leave application status' })
  status: LeaveApplicationStatus;

  @IsOptional()
  cancelDate: Date;

  @IsOptional()
  cancelReason: string;

  @IsOptional()
  hrmoApprovalDate: Date;

  @IsOptional()
  supervisorApprovalDate: Date;

  @IsOptional()
  supervisorDisapprovalRemarks: string;

  @IsOptional()
  hrdmApprovalDate: Date;

  @IsOptional()
  hrdmDisapprovalRemarks: string;

  @IsOptional()
  isLateFiling: boolean;

  @IsOptional()
  leaveApplicationDates: Date[] | { from: Date; to: Date };

  @IsOptional()
  leaveMonetization: CreateLeaveMonetizationDto;
}
export class UpdateLeaveApplicationDto extends PartialType(CreateLeaveApplicationDto) {}

export class UpdateLeaveApplicationHrmoStatusDto extends PickType(CreateLeaveApplicationDto, ['status', 'hrmoApprovalDate']) {
  id: string;
  hrmoApprovedBy?: string;
}

export class UpdateLeaveApplicationHrdmStatusDto extends PickType(CreateLeaveApplicationDto, [
  'status',
  'hrdmApprovalDate',
  'hrdmDisapprovalRemarks',
]) {
  id: string;
  hrdmApprovedBy: string;
}

export class UpdateLeaveApplicationSupervisorStatusDto extends PickType(CreateLeaveApplicationDto, [
  'status',
  'supervisorApprovalDate',
  'supervisorDisapprovalRemarks',
]) {
  id: string;
}

export class UpdateLeaveApplicationEmployeeStatus extends PickType(CreateLeaveApplicationDto, ['cancelReason']) {
  id: string;
}
