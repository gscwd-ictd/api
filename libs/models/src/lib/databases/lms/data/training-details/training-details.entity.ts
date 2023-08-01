import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingSource } from '../training-sources';
import { TrainingType } from '../training-types';
import { TrainingStatus } from '@gscwd-api/utils';

@Entity('training_details')
export class TrainingDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_details_id' })
  id: string;

  @ManyToOne(() => TrainingSource, (trainingSource) => trainingSource.id, { nullable: false })
  @JoinColumn({ name: 'training_source_id_fk' })
  trainingSource: TrainingSource;

  @ManyToOne(() => TrainingType, (trainingType) => trainingType.id, { nullable: false })
  @JoinColumn({ name: 'training_type_id_fk' })
  trainingType: TrainingType;

  @Column({ name: 'location', length: 100, nullable: true })
  location: string;

  @Column({ name: 'course_title', length: 100 })
  courseTitle: string;

  @Column({ name: 'training_start', type: 'timestamp' })
  trainingStart: Date;

  @Column({ name: 'training_end', type: 'timestamp' })
  trainingEnd: Date;

  @Column({ name: 'number_of_hours' })
  numberOfHours: number;

  @Column({ name: 'course_content', type: 'jsonb', nullable: true })
  courseContent: string;

  @Column({ name: 'deadline_for_submission', type: 'date' })
  deadlineForSubmission: Date;

  @Column({ name: 'invitation_url' })
  invitationUrl: string;

  @Column({ name: 'number_of_participants' })
  numberOfParticipants: number;

  @Column({ name: 'recommended_employees', type: 'jsonb', nullable: false })
  recommendedEmployee: string;

  @Column({ name: 'post_training_requirements', type: 'jsonb', nullable: false })
  postTrainingRequirements: string;

  @Column({ name: 'status', type: 'enum', enum: TrainingStatus, default: TrainingStatus.ON_GOING_NOMINATION })
  status: TrainingStatus;
}
