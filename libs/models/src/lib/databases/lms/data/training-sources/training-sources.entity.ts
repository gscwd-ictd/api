import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('training_sources')
export class TrainingSource extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_source_id' })
  id: string;

  @Column({ type: 'varchar', unique: true, length: 50, nullable: false })
  name: string;
}
