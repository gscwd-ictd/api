import { LeaveApplicationStatus } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateLeaveBenefitsDto } from '../leave-benefits/leave-benefits.dto';
import { LeaveBenefits } from '../leave-benefits/leave-benefits.entity';

export class CreateLeaveApplicationDto {
  @IsUUID(4, { message: 'Invalid Leave benefits UUID value.' })
  leaveBenefits: LeaveBenefits;

  @IsDate({ message: 'Invalid Date of Filing' })
  dateOfFiling: Date;

  @IsOptional()
  @IsString({ message: 'Specify place if travel is in Philippines' })
  inPhilippines: string;

  @IsOptional()
  @IsString({ message: 'Specify place if travel is abroad' })
  abroad: string;

  @IsOptional()
  @IsString({ message: 'specify illness if admitted' })
  inHospital: string;

  @IsOptional()
  @IsString({ message: 'specify illness if out patient' })
  outHospital: string;

  @IsOptional()
  @IsString({ message: 'specify in case of leave benefits for women.' })
  splWomen: string;

  @IsOptional()
  @IsBoolean({ message: 'For bar board review value must only be true of false' })
  forMastersCompletion: boolean;

  @IsOptional()
  @IsBoolean({ message: 'For bar board review value must only be true of false' })
  forBarBoardReview: boolean;

  @IsOptional()
  @IsString({ message: 'Specify other study leave details.' })
  studyLeaveOther: string;

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
}

export class UpdateLeaveApplicationDto extends PartialType(CreateLeaveApplicationDto) {}
