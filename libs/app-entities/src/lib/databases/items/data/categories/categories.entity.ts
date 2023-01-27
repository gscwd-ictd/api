import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemClassification } from '../classifications/classifications.entity';

@Entity('item_categories')
export class ItemCategory extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  id: string;

  @ManyToOne(() => ItemClassification, (classification) => classification.id, { nullable: false })
  @JoinColumn({ name: 'classification_id_fk' })
  classification: ItemClassification;

  @Column({ unique: true, length: 5 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
