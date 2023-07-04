import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TrainingIndividualDetails } from '../training-individual-details';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';

@Entity({ name: 'training_individual_distributions' })
@Unique(['trainingIndividualDetails', 'employeeId'])
export class TrainingIndividualDistribution extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_individual_distribution_id' })
  id: string;

  @ManyToOne(() => TrainingIndividualDetails, (trainingIndividualDetails) => trainingIndividualDetails.id, { nullable: false })
  @JoinColumn({ name: 'training_individual_details_id_fk' })
  trainingIndividualDetails: TrainingIndividualDetails;

  @Column({ name: 'employee_id_fk', nullable: false })
  employeeId: string;

  @Column({ name: 'no_of_slots', nullable: false })
  numberOfSlots: number;
}
