import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';

@Entity({ name: 'training_designs' })
export class TrainingDesign extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_design_id' })
  id: string;

  @Column({ name: 'course_title', type: 'varchar', nullable: false, unique: true })
  courseTitle: string;

  @Column({ name: 'course_description', type: 'varchar', nullable: false })
  courseDescription: string;

  @Column({ name: 'course_objective', type: 'varchar', nullable: false })
  courseObjective: string;

  @Column({ name: 'rationale', type: 'varchar', nullable: false })
  rationale: string;

  @Column({ name: 'target_participants', type: 'varchar', nullable: false })
  targetParticipants: string;

  @Column({ name: 'methodologies', type: 'varchar', nullable: false })
  methodologies: string;

  @Column({ name: 'expected_output', type: 'varchar', nullable: false })
  expectedOutput: string;

  @Column({ name: 'recognition', type: 'varchar', nullable: false })
  recognition: string;

  @Column({ name: 'training_start', type: 'timestamp' })
  trainingStart: Date;

  @Column({ name: 'training_end', type: 'timestamp' })
  trainingEnd: Date;
}
