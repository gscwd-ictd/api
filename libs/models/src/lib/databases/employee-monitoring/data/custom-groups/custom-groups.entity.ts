import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustomGroups extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'custom_group_id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;
}
