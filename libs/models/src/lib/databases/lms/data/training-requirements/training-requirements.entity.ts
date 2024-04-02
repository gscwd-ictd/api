import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TrainingNominee } from '../training-nominees';

@Entity('training_requirements')
@Unique(['trainingNominee'])
export class TrainingRequirements extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_requirement_id' })
  id: string;

  @OneToOne(() => TrainingNominee, (trainingNominee) => trainingNominee.id, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'training_nominee_id_fk' })
  trainingNominee: TrainingNominee;

  @Column({ name: 'attendance', type: 'boolean', default: false })
  attendance: boolean;

  @Column({ name: 'pre_test', type: 'boolean', default: null })
  preTest: boolean;

  @Column({ name: 'course_materials', type: 'boolean', default: null })
  courseMaterials: boolean;

  @Column({ name: 'post_training_report', type: 'boolean', default: null })
  postTrainingReport: boolean;

  @Column({ name: 'course_evaluation_report', type: 'boolean', default: null })
  courseEvaluationReport: boolean;

  @Column({ name: 'learning_application_plan', type: 'boolean', default: null })
  learningApplicationPlan: boolean;

  @Column({ name: 'post_test', type: 'boolean', default: null })
  postTest: boolean;

  @Column({ name: 'certificate_of_training', type: 'boolean', default: null })
  certificateOfTraining: boolean;

  @Column({ name: 'certificate_of_appearance', type: 'boolean', default: null })
  certificateOfAppearance: boolean;

  @Column({ name: 'program', type: 'boolean', default: null })
  program: boolean;
}
