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
    { itemId: 'c630c768-bb54-48e3-a21e-cb405dcbe0ac', quantity: 3, remarks: 'to be used for something' },
    { itemId: 'c29f9b1d-a052-4c34-9afa-9af6915f6985', quantity: 5 },
  ],
} as CreatePrDto;

export const PurchaseRequestStub = {
  deletedAt: null,
  code: 'PR-MAR-2023-12',
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
