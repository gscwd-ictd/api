export enum BudgetStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DISAPPROVED = 'Disapproved',
  CANCELLED = 'Cancelled',
}

export type RawCostEstimate = {
  budgetType: string;
  generalLedgerAccount: string;
  status: BudgetStatus;
};
