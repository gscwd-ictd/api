import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PpeClassification } from '../classifications/classifications.entity';

@Entity('ppe_categories')
export class PpeCategory extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  id: string;

  @ManyToOne(() => PpeClassification, (classification) => classification.id, { nullable: false })
  @JoinColumn({ name: 'classification_id_fk' })
  classification: PpeClassification;

  @Column({ unique: true, length: 5 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
