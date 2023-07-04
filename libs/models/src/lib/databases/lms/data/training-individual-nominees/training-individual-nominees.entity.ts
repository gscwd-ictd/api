import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingIndividualDistribution } from '../training-individual-distributions';
import { TrainingNomineeStatus } from '@gscwd-api/utils';

@Entity({ name: 'training_individual_nominees' })
export class TrainingIndividualNominee extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_nominee_id' })
  id: string;

  @ManyToOne(() => TrainingIndividualDistribution, (trainingIndividualDistribution) => trainingIndividualDistribution.id, { nullable: false })
  @JoinColumn({ name: 'training_individual_distribution_id_fk' })
  trainingIndividualDistribution: TrainingIndividualDistribution;

  @Column({ name: 'employee_id_fk', nullable: false })
  employeeId: string;

  @Column({ name: 'remarks', length: 100 })
  remarks: string;

  @Column({ name: 'status', type: 'enum', enum: TrainingNomineeStatus, default: TrainingNomineeStatus.PENDING })
  status: TrainingNomineeStatus;
}
