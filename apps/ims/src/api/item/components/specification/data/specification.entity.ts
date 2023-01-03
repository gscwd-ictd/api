import { DatabaseEntity, IEntity } from '@gscwd-api/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemCategory } from '../../category';

@Entity('item_specifications')
export class ItemSpecification extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'specification_id' })
  id: string;

  @ManyToOne(() => ItemCategory, (category) => category.id, { nullable: false })
  @JoinColumn({ name: 'category_id_fk' })
  category: ItemCategory;

  @Column({ name: 'reorder_point' })
  reorderPoint: number;

  @Column({ unique: true, length: 10 })
  code: string;

  @Column({ unique: true, length: 100 })
  specification: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
