import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';

@Entity({ name: 'training_design' })
export class TrainingDesign extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_design_id' })
  id: string;

  @Column({ name: 'course_title', nullable: false, unique: true })
  courseTitle: string;

  @Column({ name: 'rationale', nullable: false })
  rationale: string;

  @Column({ name: 'course_description', nullable: false })
  courseDescription: string;

  @Column({ name: 'course_objective', nullable: false })
  courseObjective: string;

  @Column({ name: 'target_participants', nullable: false })
  targetParticipants: string;

  @Column({ name: 'methodologies', nullable: false })
  methodologies: string;

  @Column({ name: 'expected_output', nullable: false })
  expectedOutput: string;

  @Column({ name: 'recognition', nullable: false })
  recognition: string;
}
