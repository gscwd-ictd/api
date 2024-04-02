import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingDesign } from '../training-designs';
import { TrainingSource } from '../training-sources';
import { TrainingStatus, TrainingType } from '@gscwd-api/utils';

@Entity('training_details')
export class TrainingDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_details_id' })
  id: string;

  @ManyToOne(() => TrainingSource, (source) => source.id, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'training_source_id_fk' })
  source: TrainingSource;

  @Column({ name: 'training_type', type: 'enum', enum: TrainingType, nullable: false })
  type: TrainingType;

  @ManyToOne(() => TrainingDesign, (trainingDesign) => trainingDesign.id, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'training_design_id_fk' })
  trainingDesign: TrainingDesign;

  @Column({ name: 'course_title', type: 'varchar', nullable: true })
  courseTitle: string;

  @Column({ name: 'course_content', type: 'jsonb', nullable: true })
  courseContent: string;

  @Column({ name: 'location', type: 'varchar', length: 500, nullable: true })
  location: string;

  @Column({ name: 'training_start', type: 'timestamp', nullable: false })
  trainingStart: Date;

  @Column({ name: 'training_end', type: 'timestamp', nullable: false })
  trainingEnd: Date;

  @Column({ name: 'number_of_hours', nullable: true })
  numberOfHours: number;

  @Column({ name: 'deadline_for_submission', type: 'date', nullable: true })
  deadlineForSubmission: Date;

  @Column({ name: 'number_of_participants', nullable: false })
  numberOfParticipants: number;

  @Column({ name: 'training_requirements', type: 'jsonb', nullable: false })
  trainingRequirements: string;

  @Column({ name: 'status', type: 'enum', enum: TrainingStatus, default: TrainingStatus.PENDING })
  status: TrainingStatus;
}
