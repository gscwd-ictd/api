import { RfqModule } from '../app/api/purchase/components/quotation';
import { PrModule } from '../app/api/purchase/components/request/core/pr.module';
import { OrgStructureModule } from '../app/services/hrms/components/org-structure';
import { ItemsModule } from '../app/services/items';

export const API_MODULES = [
  // api modules
  PrModule,
  RfqModule,

  // microservice modules
  OrgStructureModule,
  ItemsModule,
];
