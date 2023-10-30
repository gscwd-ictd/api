import { PassSlipApprovalStatus } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsMilitaryTime, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { StringifyOptions } from 'querystring';
import { PassSlip } from '../pass-slip/pass-slip.entity';

export class PassSlipApprovalDto {
  passSlipId?: PassSlip;

  @IsUUID()
  supervisorId: string;

  @IsOptional()
  @IsEnum(PassSlipApprovalStatus)
  status?: PassSlipApprovalStatus;
}

export class UpdatePassSlipApprovalDto {
  passSlipId?: PassSlip;

  @IsOptional()
  @IsEnum(PassSlipApprovalStatus)
  status: PassSlipApprovalStatus;

  @IsOptional()
  @IsDate()
  supervisorApprovalDate?: Date;

  @IsOptional()
  @IsDate()
  hrmoApprovalDate?: Date;

  @IsOptional()
  encodedTimeOut?: number;

  @IsOptional()
  @IsMilitaryTime({ message: 'Please provide proper time value' })
  encodedTimeIn?: number;

  @IsOptional()
  @IsBoolean({ message: 'Please provide a boolean value.' })
  isDisputeApproved?: boolean;

  @IsOptional()
  @IsString({ message: 'Please provide dispute remarks.' })
  disputeRemarks?: string;

  @IsOptional()
  @IsString({ message: 'Please provide HRMO disapproval remarks.' })
  hrmoDisapprovalRemarks?: string;
}
