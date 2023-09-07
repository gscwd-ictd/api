import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';

@Entity({ name: 'training_design' })
export class TrainingDesign extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_design_id' })
  id: string;

  @Column({ name: 'course_title', nullable: false, unique: true })
  courseTitle: string;

  @Column({ name: 'rationale', type: 'jsonb', nullable: false })
  rationale: string;

  @Column({ name: 'course_description', type: 'jsonb', nullable: false })
  courseDescription: string;

  @Column({ name: 'course_objective', type: 'jsonb', nullable: false })
  courseObjective: string;

  @Column({ name: 'target_participants', type: 'jsonb', nullable: false })
  targetParticipants: string;

  @Column({ name: 'methodologies', type: 'jsonb', nullable: false })
  methodologies: string;

  @Column({ name: 'expected_output', type: 'jsonb', nullable: false })
  expectedOutput: string;

  @Column({ name: 'recognition', type: 'jsonb', nullable: false })
  recognition: string;
}
