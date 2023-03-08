export enum RfqStatus {
  FOR_CANVASS = 'For Canvass',
  CANCELLED = 'Cancelled',
  CLOSED = 'Closed',
}

export enum PrStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DISAPPROVED = 'Disapproved',
  CANCELLED = 'Cancelled',
}

export type RawPurchaseRequest = {
  createdat: Date;
  updatedat: Date;
  deletedat: Date;
  detailsid: string;
  prcode: string;
  accountid: string;
  projectid: string;
  requestingoffice: string;
  prpurpose: string;
  deliveryplace: string;
  purchasetype: string;
  prstatus: PrStatus;
  addeditems: number;
};

export type PurchaseRequest = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  id: string;
  code: string;
  account: string;
  project: string;
  requestor: string;
  purpose: string;
  deliverTo: string;
  type: string;
  status: PrStatus;
  requestedItems: number;
};

export type RawRequestForQuotation = {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  rfq_details_id: string;
  code: string;
  submit_within: number;
  pr_details_id_fk: string;
  status: RfqStatus;
};

export type RequestForQuotationDetails = Pick<RawRequestForQuotation, 'code' | 'status'> & {
  id: string;
  submitWithin: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};
