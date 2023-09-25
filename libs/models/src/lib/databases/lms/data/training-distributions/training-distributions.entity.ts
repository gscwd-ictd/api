import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Training } from '../trainings';

@Entity({ name: 'training_distributions' })
@Unique(['trainingDetails', 'supervisorId'])
export class TrainingDistribution extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_distribution_id' })
  id: string;

  @ManyToOne(() => Training, (training) => training.id, { nullable: false })
  @JoinColumn({ name: 'training_id_fk' })
  training: Training;

  @Column({ name: 'employee_id_fk', nullable: false })
  supervisorId: string;

  @Column({ name: 'no_of_slots', nullable: false })
  numberOfSlots: number;
}
