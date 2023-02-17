import { PurchaseRequestModule } from '../app/api/purchase/components/purchase-request/core/purchase-request.module';
import { RequestForQuotationModule } from '../app/api/purchase/components/request-for-quotation/core/request-for-quotation.module';
import { OrgStructureModule } from '../app/services/hrms/components/org-structure';
import { ItemsModule } from '../app/services/items';

export const API_MODULES = [
  // api modules
  PurchaseRequestModule,
  RequestForQuotationModule,

  // microservice modules
  OrgStructureModule,
  ItemsModule,
];
