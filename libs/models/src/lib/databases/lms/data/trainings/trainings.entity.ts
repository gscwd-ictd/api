import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingSource } from '../training-sources';
import { TrainingType } from '../training-types';
import { TrainingStatus } from '@gscwd-api/utils';
import { LspDetails } from '../lsp-details';

@Entity('trainings')
export class Training extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_id' })
  id: string;

  @ManyToOne(() => TrainingSource, (trainingSource) => trainingSource.id, { nullable: false })
  @JoinColumn({ name: 'training_source_id_fk' })
  trainingSource: TrainingSource;

  @ManyToOne(() => TrainingType, (trainingType) => trainingType.id, { nullable: false })
  @JoinColumn({ name: 'training_type_id_fk' })
  trainingType: TrainingType;

  @ManyToOne(() => LspDetails, (lspDetails) => lspDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_details_id_fk' })
  lspDetails: LspDetails;

  @Column({ name: 'location', length: 100 })
  location: string;

  @Column({ name: 'course_title', length: 100 })
  courseTitle: string;

  @Column({ name: 'training_start', type: 'datetime' })
  trainingStart: Date;

  @Column({ name: 'training_end', type: 'datetime' })
  trainingEnd: Date;

  @Column({ name: 'number_of_hours' })
  numberOfHours: number;

  @Column({ name: 'course_content', type: 'jsonb', nullable: true })
  courseContent: string;

  @Column({ name: 'nominee_qualifications', type: 'jsonb', nullable: true })
  nomineeQualifications: string;

  @Column({ name: 'deadline_for_submission' })
  deadlineForSubmission: Date;

  @Column({ name: 'invitation_url' })
  invitationUrl: string;

  @Column({ name: 'number_of_participants' })
  numberOfParticipants: number;

  @Column({ name: 'status', type: 'enum', enum: TrainingStatus, default: TrainingStatus.ON_GOING_NOMINATION })
  status: TrainingStatus;
}
