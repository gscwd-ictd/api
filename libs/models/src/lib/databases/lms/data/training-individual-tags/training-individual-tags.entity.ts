import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TrainingIndividualDetails } from '../training-individual-details';
import { Tag } from '../tags';

@Entity({ name: 'training_individual_tags' })
@Unique(['trainingIndividualDetails', 'tag'])
export class TrainingIndividualTag extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_individual_tag_id' })
  id: string;

  @ManyToOne(() => TrainingIndividualDetails, (trainingIndividualDetails) => trainingIndividualDetails.id)
  @JoinColumn({ name: 'training_individual_details_id_fk' })
  trainingIndividualDetails: TrainingIndividualDetails;

  @ManyToOne(() => Tag, (tag) => tag.id)
  @JoinColumn({ name: 'tag_id_fk' })
  tag: Tag;
}
