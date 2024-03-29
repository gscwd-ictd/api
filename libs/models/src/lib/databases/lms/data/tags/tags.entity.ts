import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';

@Entity({ name: 'tags' })
export class Tag extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'tag_id' })
  id: string;

  @Column({ name: 'name', nullable: false, unique: true })
  name: string;
}
