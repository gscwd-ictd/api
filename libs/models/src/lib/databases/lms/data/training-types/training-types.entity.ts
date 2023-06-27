import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('training_types')
export class TrainingType extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_type_id' })
  id: string;

  @Column({ name: 'name', unique: true, length: 60 })
  name: string;

  @Column({ name: 'description', unique: true, length: 100, nullable: true })
  description: string;
}
