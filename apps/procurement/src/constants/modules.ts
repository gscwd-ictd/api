import { PurchaseRequestModule, RequestForQuotationModule } from '../app/api/purchase/components/';
import { PurchaseTypeModule } from '../app/api/purchase/components/purchase-type';
import { TermsOfPaymentModule } from '../app/api/payment/components/terms-of-payment';
import { OrgStructureModule } from '../app/services/hrms/components/org-structure';
import { ItemsModule } from '../app/services/items';
import { ModeOfPaymentModule } from '../app/api/payment/components/mode-of-payment';

export const API_MODULES = [
  // api modules
  PurchaseRequestModule,
  RequestForQuotationModule,
  PurchaseTypeModule,
  TermsOfPaymentModule,
  ModeOfPaymentModule,

  // microservice modules
  OrgStructureModule,
  ItemsModule,
];
