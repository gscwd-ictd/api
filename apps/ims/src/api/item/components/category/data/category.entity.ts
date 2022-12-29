import { DatabaseEntity, IEntity } from '@gscwd-api/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemClassification } from '../../classification';
import { MeasurementUnit } from '../../unit/data/unit.entity';

@Entity('item_categories')
export class ItemCategory extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  id: string;

  @ManyToOne(() => ItemClassification, (classification) => classification.id)
  @JoinColumn({ name: 'classification_id_fk' })
  classification: ItemClassification;

  @ManyToOne(() => MeasurementUnit, (unit) => unit.unitId)
  @JoinColumn({ name: 'unit_id_fk' })
  unit: MeasurementUnit;

  @Column({ unique: true, length: 5 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
