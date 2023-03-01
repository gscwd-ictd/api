import { PurchaseRequest, RequestForQuotation, RequestedItem, PurchaseType, PrCodeSequence } from '@gscwd-api/models';

export const DB_ENTITIES = [
  // entities
  PurchaseRequest,
  RequestedItem,
  RequestForQuotation,
  PurchaseType,

  // utility tables
  PrCodeSequence,
];
