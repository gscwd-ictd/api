import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TrainingDistribution } from '../training-distributions';
import { NomineeType, TrainingNomineeStatus } from '@gscwd-api/utils';

@Entity({ name: 'training_nominees' })
@Unique(['trainingDistribution', 'employeeId'])
export class TrainingNominee extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_nominee_id' })
  id: string;

  @ManyToOne(() => TrainingDistribution, (trainingDistribution) => trainingDistribution.id, { nullable: false })
  @JoinColumn({ name: 'training_distribution_id_fk' })
  trainingDistribution: TrainingDistribution;

  @Column({ name: 'employee_id_fk', nullable: false })
  employeeId: string;

  @Column({
    name: 'nominee_type',
    type: 'enum',
    enum: NomineeType,
    nullable: false,
  })
  nomineeType: NomineeType;

  @Column({ name: 'batch_number', type: 'int', nullable: true })
  batchNumber: number;

  @Column({ name: 'training_start', type: 'timestamp', nullable: true })
  trainingStart: Date;

  @Column({ name: 'training_end', type: 'timestamp', nullable: true })
  trainingEnd: Date;

  @Column({ name: 'remarks', length: 200, nullable: true })
  remarks: string;

  @Column({ name: 'status', type: 'enum', enum: TrainingNomineeStatus, default: TrainingNomineeStatus.PENDING })
  status: TrainingNomineeStatus;
}
