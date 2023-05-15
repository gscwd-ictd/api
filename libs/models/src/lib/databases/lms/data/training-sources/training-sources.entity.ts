import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('training_sources')
export class TrainingSource extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_source_id' })
  id: string;

  @Column({ unique: true, length: 50 })
  name: string;
}
