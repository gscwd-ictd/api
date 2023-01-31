import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemSpecification } from '../specifications/specifications.entity';

@Entity('item_details')
export class ItemDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'details_id' })
  id: string;

  @OneToOne(() => ItemSpecification, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'specification_id_fk' })
  specification: ItemSpecification;

  @Column({ type: 'integer', default: 0 })
  balance: number;

  @Column({ name: 'reorder_point', type: 'integer', default: 0 })
  reorderPoint: number;

  @Column({ name: 'reorder_quantity', type: 'integer', default: 0 })
  reorderQuantity: number;
}
