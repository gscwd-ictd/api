import { CrudModule } from '@gscwd-api/crud';
import { PurchaseRequest } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { OrgStructureModule } from '../../../../../services/hrms/components/org-structure';
import { RequestedItemModule } from '../../requested-item/core/requested-item.module';
import { PurchaseRequestController } from './purchase-request.controller';
import { PurchaseRequestService } from './purchase-request.service';

@Module({
  imports: [CrudModule.register(PurchaseRequest), RequestedItemModule, OrgStructureModule],
  controllers: [PurchaseRequestController],
  providers: [PurchaseRequestService],
  exports: [PurchaseRequestService],
})
export class PurchaseRequestModule {}
