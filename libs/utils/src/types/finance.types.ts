export enum BudgetStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DISAPPROVED = 'Disapproved',
  CANCELLED = 'Cancelled',
}

export type RawCostEstimate = {
  budgetType: string;
  generalLedgerAccount: string;
  projectName: string;
  location: string;
  subject: string;
  workDescription: string;
  quantity: number;
  outputPerDay: number;
};

export type RawProjectDetails = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: string;
  projectName: string;
  location: string;
  subject: string;
  workDescription: string;
  quantity: number;
  outputPerDay: number;
  budgetDetails: {
    status: string;
    budgetType: {
      name: string;
    };
    generalLedgerAccount: {
      name: string;
    };
  };
};

export type ProjectDetailsSummary = {
  id: string;
  projectName: string;
  location: string;
  subject: string;
  workDescription: string;
  status: string;
};

export type ProjectDetails = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: string;
  projectName: string;
  location: string;
  subject: string;
  workDescription?: string;
  quantity?: number;
  outputPerDay?: number;
  budgetDetails: {
    status: string;
    type: string;
    account: {
      generalLedgerAccountName: string;
    };
  };
};
