import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingDistribution } from '../training-distributions';

@Entity('training_recommended_employees')
export class TrainingRecommendedEmployee extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_recommended_employee_id' })
  id: string;

  @ManyToOne(() => TrainingDistribution, (trainingDistribution) => trainingDistribution.id, { nullable: false })
  @JoinColumn({ name: 'training_distribution_id_fk' })
  trainingDistribution: TrainingDistribution;

  @Column({ name: 'employee_id_fk', nullable: false })
  employeeId: string;
}
