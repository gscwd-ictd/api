import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingDetails } from '../training-details';
import { TrainingDistributionStatus } from '@gscwd-api/utils';

@Entity({ name: 'training_distributions' })
export class TrainingDistribution extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_distribution_id' })
  id: string;

  @ManyToOne(() => TrainingDetails, (trainingDetails) => trainingDetails.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDetails;

  @Column({ name: 'employee_id_fk', nullable: false })
  supervisorId: string;

  @Column({ name: 'no_of_slots', nullable: false })
  numberOfSlots: number;

  @Column({ name: 'status', type: 'enum', enum: TrainingDistributionStatus, default: TrainingDistributionStatus.NOMINATION_PENDING })
  status: TrainingDistributionStatus;
}
