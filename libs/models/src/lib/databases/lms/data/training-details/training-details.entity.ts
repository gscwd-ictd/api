import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('training_details')
export class TrainingDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_details_id' })
  id: string;

  @Column({ name: 'course_title', length: 100 })
  courseTitle: string;

  @Column({ name: 'course_content', type: 'jsonb', nullable: true })
  courseContent: string;

  @Column({ name: 'location', type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ name: 'training_start', type: 'timestamp' })
  trainingStart: Date;

  @Column({ name: 'training_end', type: 'timestamp' })
  trainingEnd: Date;

  @Column({ name: 'number_of_hours' })
  numberOfHours: number;

  @Column({ name: 'deadline_for_submission', type: 'date' })
  deadlineForSubmission: Date;

  @Column({ name: 'invitation_url' })
  invitationUrl: string;

  @Column({ name: 'number_of_participants' })
  numberOfParticipants: number;

  @Column({ name: 'post_training_requirements', type: 'jsonb', nullable: false })
  postTrainingRequirements: string;
}
