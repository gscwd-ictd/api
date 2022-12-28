import { DatabaseEntity } from '@gscwd-api/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemCharacteristic } from '../../characteristic';

@Entity('item_classification')
export class ItemClassification extends DatabaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'classification_id' })
  classificationId: string;

  @ManyToOne(() => ItemCharacteristic, (item) => item.characteristicId)
  @JoinColumn({ name: 'characteristic_id_fk' })
  characteristicId: string;

  @Column({ unique: true, length: 3 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
