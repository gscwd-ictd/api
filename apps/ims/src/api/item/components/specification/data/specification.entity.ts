import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { UnitOfMeasure } from '../../../../unit/components/unit-of-measure';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemCategory } from '../../category';

@Entity('item_specifications')
export class ItemSpecification extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'specification_id' })
  id: string;

  @ManyToOne(() => ItemCategory, (category) => category.id, { nullable: false })
  @JoinColumn({ name: 'category_id_fk' })
  category: ItemCategory;

  @ManyToOne(() => UnitOfMeasure, (unit) => unit.id, { nullable: false })
  @JoinColumn({ name: 'unit_of_measure_id_fk' })
  unit: UnitOfMeasure;

  @Column({ unique: true, length: 10 })
  code: string;

  @Column({ unique: true, length: 100 })
  details: string;

  @Column()
  quantity: number;

  @Column({ name: 'reordering_point' })
  reorderPoint: number;

  @Column({ name: 'reordering_quantity', nullable: true })
  reorderQuantity: number;

  @Column({ type: 'text', nullable: true })
  description: string;
}
