import { PassSlipApprovalStatus } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { StringifyOptions } from 'querystring';
import { PassSlip } from '../pass-slip/pass-slip.entity';

export class PassSlipApprovalDto {
  passSlipId?: PassSlip;

  @IsUUID()
  supervisorId: string;

  @IsEnum(PassSlipApprovalStatus)
  status?: PassSlipApprovalStatus;
}

export class UpdatePassSlipApprovalDto {
  passSlipId?: PassSlip;
  @IsEnum(PassSlipApprovalStatus)
  status: PassSlipApprovalStatus;
  supervisorApprovalDate?: Date;
  hrmoApprovalDate?: Date;
  encodedTimeOut?: number;
  encodedTimeIn?: number;
  disputeRemarks?: string;
}
