import { DatabaseEntity, IEntity } from '@gscwd-api/entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'material_costs' })
export class MaterialCost extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'material_cost_id' })
  id: string;

  @Column({ name: 'project_name', type: 'text', nullable: true })
  project_name: string;

  @Column({ name: 'location', type: 'text', nullable: true })
  location: string;

  @Column({ name: 'item_number', type: 'text', nullable: true })
  itemNumber: string;

  @Column({ name: 'work_description', type: 'text', nullable: true })
  workDescription: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'output_per_day' })
  outputPerDay: number;
}
