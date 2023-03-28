import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'budget_types' })
export class BudgetType extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'budget_type_id' })
  id: string;

  @Column({ unique: true, length: 60 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
