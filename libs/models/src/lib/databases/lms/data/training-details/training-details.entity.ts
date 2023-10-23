import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TrainingDesign } from '../training-designs';
import { TrainingSource } from '../training-sources';
import { TrainingPreparationStatus, TrainingStatus, TrainingType } from '@gscwd-api/utils';

@Entity('training_details')
export class TrainingDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_details_id' })
  id: string;

  @ManyToOne(() => TrainingSource, (trainingSource) => trainingSource.id, { nullable: false })
  @JoinColumn({ name: 'training_source_id_fk' })
  trainingSource: TrainingSource;

  @Column({ name: 'training_type', type: 'enum', enum: TrainingType, nullable: false })
  trainingType: TrainingType;

  @ManyToOne(() => TrainingDesign, (trainingDesign) => trainingDesign.id, { nullable: true })
  @JoinColumn({ name: 'training_design_id_fk' })
  trainingDesign: TrainingDesign;

  @Column({ name: 'course_title', type: 'varchar', length: 100, nullable: true })
  courseTitle: string;

  @Column({ name: 'course_content', type: 'jsonb', nullable: true })
  courseContent: string;

  @Column({ name: 'location', type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ name: 'training_start', type: 'timestamp', nullable: false })
  trainingStart: Date;

  @Column({ name: 'training_end', type: 'timestamp', nullable: false })
  trainingEnd: Date;

  @Column({ name: 'number_of_hours', nullable: false })
  numberOfHours: number;

  @Column({ name: 'deadline_for_submission', type: 'date', nullable: false })
  deadlineForSubmission: Date;

  @Column({ name: 'bucket_files', type: 'jsonb', nullable: true })
  bucketFiles: string;

  @Column({ name: 'number_of_participants', nullable: false })
  numberOfParticipants: number;

  @Column({ name: 'training_requirements', type: 'jsonb', nullable: false })
  trainingRequirements: string;

  @Column({
    name: 'training_preparation_status',
    type: 'enum',
    enum: TrainingPreparationStatus,
    default: TrainingPreparationStatus.PENDING,
    nullable: false,
  })
  trainingPreparationStatus: TrainingPreparationStatus;

  @Column({ name: 'status', type: 'enum', enum: TrainingStatus, nullable: true })
  status: TrainingStatus;
}
