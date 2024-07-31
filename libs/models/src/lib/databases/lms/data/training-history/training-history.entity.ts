import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TrainingDetails } from '../training-details';
import { TrainingHistoryType } from '@gscwd-api/utils';

@Unique(['trainingDetails', 'trainingHistoryType'])
@Entity({ name: 'training_history' })
export class TrainingHistory extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_history_id' })
  id: string;

  @ManyToOne(() => TrainingDetails, (trainingDetails) => trainingDetails.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDetails;

  @Column({ name: 'training_history', type: 'enum', enum: TrainingHistoryType, nullable: false })
  trainingHistoryType: TrainingHistoryType;
}
