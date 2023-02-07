import { CrudModule } from '@gscwd-api/crud';
import { PassSlipApproval } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { PassSlipApprovalController } from './pass-slip-approval.controller';
import { PassSlipApprovalService } from './pass-slip-approval.service';

@Module({
  imports: [CrudModule.register(PassSlipApproval)],
  providers: [PassSlipApprovalService],
  controllers: [PassSlipApprovalController],
  exports: [PassSlipApprovalService],
})
export class PassSlipApprovalModule {}
