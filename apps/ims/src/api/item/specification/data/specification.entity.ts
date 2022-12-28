import { DatabaseEntity } from '@gscwd-api/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemCategory } from '../../category';

@Entity('item_specifications')
export class ItemSpecification extends DatabaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'specification_id' })
  specificationId: string;

  @ManyToOne(() => ItemCategory, (item) => item.categoryId)
  @JoinColumn({ name: 'category_id_fk' })
  categoryId: string;

  @Column({ name: 'reorder_point' })
  reorderPoint: number;

  @Column({ unique: true, length: 10 })
  code: string;

  @Column({ unique: true, length: 100 })
  specification: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
