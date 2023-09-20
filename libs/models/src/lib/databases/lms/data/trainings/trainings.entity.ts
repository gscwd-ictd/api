import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingDesign } from '../training-designs';
import { TrainingDetails } from '../training-details';
import { TrainingSource } from '../training-sources';

@Entity({ name: 'trainings' })
export class Trainings extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_id' })
  id: string;

  @ManyToOne(() => TrainingDesign, (trainingDesign) => trainingDesign.id, { nullable: true })
  @JoinColumn({ name: 'training_design_id_fk' })
  trainingDesign: TrainingDesign;

  @ManyToOne(() => TrainingDetails, (trainingDetails) => trainingDetails.id, { nullable: true })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDesign;

  @ManyToOne(() => TrainingSource, (trainingSource) => trainingSource.id, { nullable: false })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDesign;
}
