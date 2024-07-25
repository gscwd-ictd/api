import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Tag } from '../tags';
import { TrainingDetails } from '../training-details';

@Entity({ name: 'training_tags' })
@Unique(['trainingDetails', 'tag'])
export class TrainingTag extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_tag_id' })
  id: string;

  @ManyToOne(() => TrainingDetails, (trainingDetails) => trainingDetails.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDetails;

  @ManyToOne(() => Tag, (tag) => tag.id)
  @JoinColumn({ name: 'tag_id_fk' })
  tag: Tag;
}
