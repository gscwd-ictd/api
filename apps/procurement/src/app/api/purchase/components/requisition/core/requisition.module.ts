import { Module } from '@nestjs/common';
import { PurchaseRequisitionService } from './requisition.service';
import { PurchaseRequisitionController } from './requisition.controller';
import { CrudModule } from '@gscwd-api/crud';
import { PurchaseRequestDetails } from '@gscwd-api/models';
import { ItemsModule } from '../../../../../services/items';
import { OrgStructureModule } from '../../../../../services/hrms/components/org-structure';

@Module({
  imports: [CrudModule.register(PurchaseRequestDetails), ItemsModule, OrgStructureModule],
  providers: [PurchaseRequisitionService],
  controllers: [PurchaseRequisitionController],
})
export class PurchaseRequisitionModule {}
