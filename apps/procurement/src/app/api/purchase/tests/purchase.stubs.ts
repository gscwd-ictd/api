import { CreatePrDto } from '../components/purchase-request/data/pr.dto';

export const CreatePurchaseTypeDtoStub = {
  type: 'Direct Purchase',
} as const;

export const PurchaseTypeStub = {
  type: 'Direct Purchase',
};

export const CreatePrDtoStub = {
  details: {
    accountId: 'f3ba31db-fef0-4a88-b736-2d4ab9b939d8',
    projectId: 'f3ba31db-fef0-4a88-b736-2d4ab9b939d8',
    requestingOffice: 'f3ba31db-fef0-4a88-b736-2d4ab9b939d8',
    purpose: 'for office tasks',
    deliveryPlace: 'gensan',
    // purchaseType: '0b296418-8cb2-4de4-b0e4-3471b163906f',
  },
  items: [
    { itemId: '84195b95-96a4-4381-8bf1-95eaba359c59', quantity: 3, remarks: 'to be used for something' },
    { itemId: '238e5a78-4204-4d3e-9f62-ac891d7850a1', quantity: 5 },
  ],
} as CreatePrDto;

export const PurchaseRequestStub = {
  deletedAt: null,
  code: 'PR-MAR-2023-1',
  account: 'f3ba31db-fef0-4a88-b736-2d4ab9b939d8',
  project: 'f3ba31db-fef0-4a88-b736-2d4ab9b939d8',
  requestor: 'f3ba31db-fef0-4a88-b736-2d4ab9b939d8',
  purpose: 'for office tasks',
  deliverTo: 'gensan',
  type: 'Direct Purchase',
  status: 'Pending',
  requestedItems: '2',
};

export const RequestedForQuotationStub = {
  code: 'RFQ-MAR-2023-1',
  status: 'For Canvass',
  submitWithin: 7,
  deletedAt: null,
};
