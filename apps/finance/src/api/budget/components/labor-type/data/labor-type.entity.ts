import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'labor_types' })
export class LaborType extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'labor_type_id' })
  id: string;

  @Column({ name: 'description', type: 'text', unique: true })
  description: string;
}
