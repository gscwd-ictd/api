import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';
import { OtherTrainingCategory, OtherTrainingStatus, TrainingType } from '@gscwd-api/utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'other_trainings' })
export class OtherTraining extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'other_training_id' })
  id: string;

  @Column({ name: 'title', type: 'text', nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({ name: 'date_from', type: 'date', nullable: false })
  dateFrom: Date;

  @Column({ name: 'date_to', type: 'date', nullable: false })
  dateTo: Date;

  @Column({ name: 'location', type: 'text', nullable: true })
  location: string;

  @Column({ name: 'category', type: 'enum', enum: OtherTrainingCategory, nullable: false })
  category: OtherTrainingCategory;

  @Column({ name: 'training_type', type: 'enum', enum: TrainingType, nullable: true })
  type: TrainingType;

  @Column({ name: 'training_requirements', type: 'jsonb', nullable: false })
  trainingRequirements: string;

  @Column({ name: 'status', type: 'enum', enum: OtherTrainingStatus, nullable: false, default: OtherTrainingStatus.PENDING })
  status: OtherTrainingStatus;
}
