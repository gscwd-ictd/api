import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { BudgetStatus } from '@gscwd-api/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetType } from '../budget-types';
import { GeneralLedgerAccount } from '../general-ledger-accounts';

@Entity({ name: 'budget_details' })
export class BudgetDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'budget_details_id' })
  id: string;

  @ManyToOne(() => BudgetType, (budgetType) => budgetType.id, { nullable: false })
  @JoinColumn({ name: 'budget_type_id_fk' })
  budgetType: BudgetType;

  @ManyToOne(() => GeneralLedgerAccount, (generalLedgerAccount) => generalLedgerAccount.id, { nullable: false })
  @JoinColumn({ name: 'general_ledger_account_id_fk' })
  generalLedgerAccount: GeneralLedgerAccount;

  @Column({ type: 'enum', enum: BudgetStatus, default: BudgetStatus.PENDING })
  status: BudgetStatus;
}
