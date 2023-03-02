import { PurchaseRequestModule, RequestForQuotationModule } from '../app/api/purchase/components/';
import { PurchaseTypeModule } from '../app/api/purchase/components/purchase-type';
import { SuppliersModule } from '../app/api/suppliers/core/suppliers.module';
import { OrgStructureModule } from '../app/services/hrms/components/org-structure';
import { ItemsModule } from '../app/services/items';

export const API_MODULES = [
  // api modules
  PurchaseRequestModule,
  RequestForQuotationModule,
  PurchaseTypeModule,
  SuppliersModule,
  // microservice modules
  OrgStructureModule,
  ItemsModule,
];
