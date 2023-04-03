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
