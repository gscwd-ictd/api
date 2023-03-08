import { PurchaseRequestModule, RequestForQuotationModule } from '../app/api/purchase/components/';
import { PurchaseTypeModule } from '../app/api/purchase/components/purchase-type';
import { OrgStructureModule } from '../app/services/hrms/components/org-structure';
import { ItemsModule } from '../app/services/items';

export const API_MODULES = [
  // api modules
  PurchaseRequestModule,
  RequestForQuotationModule,
  PurchaseTypeModule,

  // microservice modules
  OrgStructureModule,
  ItemsModule,
];
