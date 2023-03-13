import { PurchaseRequestDetails, RequestForQuotation, RequestedItem, PurchaseType, RequestedItemsForRfqView, Supplier } from '@gscwd-api/models';

export const DB_ENTITIES = [
  // entities
  PurchaseRequestDetails,
  RequestedItem,
  RequestForQuotation,
  PurchaseType,
  Supplier,

  // views
  RequestedItemsForRfqView,
];
