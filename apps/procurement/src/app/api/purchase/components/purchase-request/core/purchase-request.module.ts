import { Module } from '@nestjs/common';
import { RequestedItemModule } from '../../requested-item';
import { PurchaseRequestController } from './purchase-request.controller';
import { PurchaseRequestService } from './purchase-request.service';
import { OrgStructureModule } from '../../../../../services/hrms/components/org-structure';
import { CostEstimateModule } from '../../../../../services/finance/components/cost-estimate/';

@Module({
  imports: [RequestedItemModule, OrgStructureModule, CostEstimateModule],
  controllers: [PurchaseRequestController],
  providers: [PurchaseRequestService],
  exports: [PurchaseRequestService],
})
export class PurchaseRequestModule {}
