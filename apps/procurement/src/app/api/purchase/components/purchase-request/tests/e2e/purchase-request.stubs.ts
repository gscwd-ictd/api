export const CreatePurchaseRequestDtoStub = {
  details: {
    id: 'c9048bfb-4e34-42cb-9ec1-5c1f3228b398',
    code: 'PR-123',
    accountId: '2bba9073-a9a5-48ce-b7be-6413947a110f',
    projectId: '51d23ae2-82f6-415e-9cb0-ff2d68fc988e',
    requestingOffice: '90440de1-f048-11ec-8d31-c4bde5a04065',
    purchaseType: '92ee26a8-926e-4c37-8f9c-e7d596bd2ed1',
    purpose: 'for office tasks',
    deliveryPlace: 'General Santos Water District',
  },
  items: [
    {
      itemId: '902b545c-04c4-4331-a9fa-39fefea7f92a',
      quantity: 5,
      remarks: 'See attached file',
    },
    {
      itemId: '722e3788-81ca-4b4d-8881-6a8586de85dd',
      quantity: 8,
      remarks: 'See attached file',
    },
  ],
};

export const CreatedPurchaseRequestStub = {
  details: {
    id: 'c9048bfb-4e34-42cb-9ec1-5c1f3228b398',
    code: 'PR-MAR-2023-1',
    accountId: '2bba9073-a9a5-48ce-b7be-6413947a110f',
    projectId: '51d23ae2-82f6-415e-9cb0-ff2d68fc988e',
    requestingOffice: '90440de1-f048-11ec-8d31-c4bde5a04065',
    purchaseType: '92ee26a8-926e-4c37-8f9c-e7d596bd2ed1',
    purpose: 'for office tasks',
    deliveryPlace: 'General Santos Water District',
  },
  items: 2,
};

export const PurchaseRequestStub = {
  id: 'c9048bfb-4e34-42cb-9ec1-5c1f3228b398',
  code: 'PR-123',
  purpose: 'for office tasks',
  status: 'Pending',
  purchaseType: {
    type: 'Direct Purchase',
  },
};

export const PurchaseRequestInfoStub = {
  id: 'c9048bfb-4e34-42cb-9ec1-5c1f3228b398',
  code: 'PR-123',
  accountId: '2bba9073-a9a5-48ce-b7be-6413947a110f',
  projectId: '51d23ae2-82f6-415e-9cb0-ff2d68fc988e',
  requestingOffice: 'Recruitment and Personnel Welfare Division',
  purpose: 'for office tasks',
  deliveryPlace: 'General Santos Water District',
  status: 'Pending',
  placeOfDelivery: 'General Santos Water District',
  items: [
    {
      itemId: '902b545c-04c4-4331-a9fa-39fefea7f92a',
      quantity: 5,
      remarks: 'See attached file',
      info: {
        id: '902b545c-04c4-4331-a9fa-39fefea7f92a',
        code: 'PHY-OFC-3VCE6-PAH1PT8LSB',
        classification: 'Office Supplies',
        item: 'Bond Paper',
        unit: 'pcs',
        details: 'A4',
        description: '',
        balance: 0,
        reorder: {
          point: 0,
          quantity: 0,
        },
      },
    },
    {
      itemId: '722e3788-81ca-4b4d-8881-6a8586de85dd',
      quantity: 8,
      remarks: 'See attached file',
      info: {
        id: '722e3788-81ca-4b4d-8881-6a8586de85dd',
        code: 'PHY-OFC-QFBA2-87Q0N11HYB',
        classification: 'Office Supplies',
        item: 'Ballpen',
        unit: 'pcs',
        details: 'Red ink',
        description: '',
        balance: 120,
        reorder: {
          point: 0,
          quantity: 0,
        },
      },
    },
  ],
};
