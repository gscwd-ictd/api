import { DatabaseEntity, IEntity } from '@gscwd-api/entity';
import { UnitOfMeasure } from '../../../../unit/components/unit-of-measure/';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemClassification } from '../../classification';

@Entity('item_categories')
export class ItemCategory extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  id: string;

  @ManyToOne(() => ItemClassification, (classification) => classification.id, { nullable: false })
  @JoinColumn({ name: 'classification_id_fk' })
  classification: ItemClassification;

  @ManyToOne(() => UnitOfMeasure, (unit) => unit.id, { nullable: false })
  @JoinColumn({ name: 'unit_of_measure_id_fk' })
  unit: UnitOfMeasure;

  @Column({ unique: true, length: 5 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
