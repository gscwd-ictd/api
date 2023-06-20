import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Training } from '../trainings';
import { Tag } from '../tags';

@Entity({ name: 'training_tags' })
@Unique(['training', 'tag'])
export class TrainingTag extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_tag_id' })
  id: string;

  @ManyToOne(() => Training, (trainingTag) => trainingTag.id)
  @JoinColumn({ name: 'training_id_fk' })
  training: Training;

  @ManyToOne(() => Tag, (tag) => tag.id)
  @JoinColumn({ name: 'tag_id_fk' })
  tag: Tag;
}
