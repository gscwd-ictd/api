import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';

@Entity({ name: 'tags' })
export class Tag extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'tag_id' })
  id: string;

  @Column({ name: 'name', nullable: false, unique: true })
  name: string;
}
