import { PassSlipApprovalStatus } from '@gscwd-api/utils';
import { IsEnum, IsUUID } from 'class-validator';
import { PassSlip } from '../pass-slip/pass-slip.entity';

export class PassSlipApprovalDto {
  passSlipId?: PassSlip;

  @IsUUID()
  supervisorId: string;

  @IsEnum(PassSlipApprovalStatus)
  status: PassSlipApprovalStatus;
}
