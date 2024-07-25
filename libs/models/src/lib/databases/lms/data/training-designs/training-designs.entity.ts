import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';

@Entity({ name: 'training_designs' })
export class TrainingDesign extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_design_id' })
  id: string;

  @Column({ name: 'course_title', type: 'varchar', nullable: false, unique: true })
  courseTitle: string;

  @Column({ name: 'course_description', type: 'jsonb', nullable: false })
  courseDescription: object;

  @Column({ name: 'course_objective', type: 'jsonb', nullable: false })
  courseObjective: object;

  @Column({ name: 'rationale', type: 'jsonb', nullable: false })
  rationale: object;

  @Column({ name: 'target_participants', type: 'jsonb', nullable: false })
  targetParticipants: object;

  @Column({ name: 'methodologies', type: 'jsonb', nullable: false })
  methodologies: object;

  @Column({ name: 'expected_output', type: 'jsonb', nullable: false })
  expectedOutput: object;

  @Column({ name: 'recognition', type: 'jsonb', nullable: false })
  recognition: object;
}
