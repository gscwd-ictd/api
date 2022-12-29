import { DatabaseEntity, IEntity } from '@gscwd-api/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemCharacteristic } from '../../characteristic';

@Entity('item_classification')
export class ItemClassification extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'classification_id' })
  id: string;

  @ManyToOne(() => ItemCharacteristic, (characteristic) => characteristic.id)
  @JoinColumn({ name: 'characteristic_id_fk' })
  characteristic: ItemCharacteristic;

  @Column({ unique: true, length: 3 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
