import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('training_types')
export class TrainingType extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_type_id' })
  id: string;

  @Column({ unique: true, length: 50 })
  name: string;
}
