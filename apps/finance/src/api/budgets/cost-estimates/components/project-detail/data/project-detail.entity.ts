import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'project_details' })
export class ProjectDetail extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'project_details_id' })
  id: string;

  @Column({ name: 'project_name', type: 'text', nullable: true })
  projectName: string;

  @Column({ name: 'location', type: 'text', nullable: true })
  location: string;

  @Column({ name: 'item_number', type: 'text', nullable: true })
  itemNumber: string;

  @Column({ name: 'work_description', type: 'text', nullable: true })
  workDescription: string;

  @Column({ name: 'quantity', type: 'integer' })
  quantity: number;

  @Column({ name: 'output_per_day', type: 'integer' })
  outputPerDay: number;
}
