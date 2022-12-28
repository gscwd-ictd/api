import { DatabaseEntity } from '@gscwd-api/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemClassification } from '../../classification';
import { MeasurementUnit } from '../../unit/data/unit.entity';

@Entity('item_categories')
export class ItemCategory extends DatabaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => ItemClassification, (item) => item.classificationId)
  @JoinColumn({ name: 'classification_id_fk' })
  classificationId: string;

  @ManyToOne(() => MeasurementUnit, (unit) => unit.unitId)
  @JoinColumn({ name: 'unit_id_fk' })
  unitId: string;

  @Column({ unique: true, length: 5 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
