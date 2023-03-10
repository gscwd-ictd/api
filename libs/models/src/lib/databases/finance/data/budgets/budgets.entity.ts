import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum Status {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DISAPPROVED = 'Disapproved',
  CANCELLED = 'Cancelled',
}

@Entity({ name: 'budgets' })
export class Budget extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'budget_id' })
  id: string;

  @Column({ unique: true, length: 2 })
  budget_type: string;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;
}
