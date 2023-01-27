import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ItemCategory } from '../categories/categories.entity';
import { UnitOfMeasure } from '../unit-of-measure';

@Entity('item_specifications')
@Unique(['category', 'name'])
export class ItemSpecification extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'specification_id' })
  id: string;

  @ManyToOne(() => ItemCategory, (category) => category.id, { nullable: false })
  @JoinColumn({ name: 'category_id_fk' })
  category: ItemCategory;

  @ManyToOne(() => UnitOfMeasure, (unit) => unit.id)
  @JoinColumn({ name: 'unit_id_fk' })
  unit: UnitOfMeasure;

  @Column({ unique: true, length: 10 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
