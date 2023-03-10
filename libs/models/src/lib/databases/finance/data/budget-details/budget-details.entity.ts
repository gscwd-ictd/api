import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetType } from '../budget-types';

enum Status {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DISAPPROVED = 'Disapproved',
  CANCELLED = 'Cancelled',
}

@Entity({ name: 'budget-details' })
export class BudgetDetail extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'budget_detail_id' })
  id: string;

  @ManyToOne(() => BudgetType, (budgetType) => budgetType.id, { nullable: false })
  @JoinColumn({ name: 'budget_type_id_fk' })
  budgetType: BudgetType;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;
}
