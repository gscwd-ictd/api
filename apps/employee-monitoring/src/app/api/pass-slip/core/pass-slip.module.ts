import { CrudModule } from '@gscwd-api/crud';
import { PassSlip } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { PassSlipApprovalModule } from '../components/approval/core/pass-slip-approval.module';
import { PassSlipController } from './pass-slip.controller';
import { PassSlipService } from './pass-slip.service';

@Module({
  imports: [CrudModule.register(PassSlip), PassSlipApprovalModule],
  providers: [PassSlipService],
  controllers: [PassSlipController],
  exports: [PassSlipService],
})
export class PassSlipModule {}
