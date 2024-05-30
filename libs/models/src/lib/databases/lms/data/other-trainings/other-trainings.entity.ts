import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { OtherTrainingCategory, OtherTrainingStatus } from '@gscwd-api/utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'other_trainings' })
export class OtherTraining extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'other_training_id' })
  id: string;

  @Column({ name: 'title', type: 'text', nullable: false })
  title: string;

  @Column({ name: 'date_from', type: 'date', nullable: false })
  dateFrom: Date;

  @Column({ name: 'date_to', type: 'date', nullable: false })
  dateTo: Date;

  @Column({ name: 'location', type: 'text', nullable: true })
  location: string;

  @Column({ name: 'category', type: 'enum', enum: OtherTrainingCategory, nullable: false })
  category: OtherTrainingCategory;

  @Column({ name: 'status', type: 'enum', enum: OtherTrainingStatus, nullable: false, default: OtherTrainingStatus.PENDING })
  status: OtherTrainingStatus;
}
