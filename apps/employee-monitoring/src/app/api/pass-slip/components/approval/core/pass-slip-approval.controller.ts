import { Controller } from '@nestjs/common';
import { PassSlipApprovalService } from './pass-slip-approval.service';

@Controller('pass-slip-approval')
export class PassSlipApprovalController {
  constructor(private readonly passSlipApprovalService: PassSlipApprovalService) {}
}
