import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingDistribution } from '../training-distributions';
import { TrainingNomineeStatus } from '@gscwd-api/utils';

@Entity({ name: 'training_nominees' })
export class TrainingNominee extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_nominee_id' })
  id: string;

  @ManyToOne(() => TrainingDistribution, (trainingDistribution) => trainingDistribution.id, { nullable: false })
  @JoinColumn({ name: 'training_distribution_id_fk' })
  trainingDistribution: TrainingDistribution;

  @Column({ name: 'employee_id_fk', nullable: false })
  employeeId: string;

  @Column({ name: 'remarks', length: 100 })
  remarks: string;

  @Column({ name: 'status', type: 'enum', enum: TrainingNomineeStatus, default: TrainingNomineeStatus.PENDING })
  status: TrainingNomineeStatus;
}