import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TrainingDistribution } from '../training-distributions';

@Entity('training_recommended_employees')
@Unique(['trainingDistribution', 'employeeId'])
export class TrainingRecommendedEmployee extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_recommended_employee_id' })
  id: string;

  @ManyToOne(() => TrainingDistribution, (trainingDistribution) => trainingDistribution.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'training_distribution_id_fk' })
  trainingDistribution: TrainingDistribution;

  @Column({ name: 'employee_id_fk', nullable: false })
  employeeId: string;
}
