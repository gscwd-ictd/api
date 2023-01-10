import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/entities';

@Entity('property_categories')
export class PropertyCategory extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'property_category_id' })
  id: string;

  @Column({ unique: true, length: 5 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text' })
  description: string;
}
