import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'training_history' })
export class TrainingHistory extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_history_id' })
  id: string;

  @Column({ name: 'title', type: 'text', nullable: false })
  title: string;

  @Column({ name: 'status', type: 'text', nullable: false })
  status: string;
}
