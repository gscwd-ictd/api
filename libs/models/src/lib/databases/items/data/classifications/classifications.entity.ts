import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemCharacteristic } from '../characteristics/characteristics.entity';

@Entity('item_classifications')
export class ItemClassification extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'classification_id' })
  id: string;

  @ManyToOne(() => ItemCharacteristic, (characteristic) => characteristic.id, { nullable: false })
  @JoinColumn({ name: 'characteristic_id_fk' })
  characteristic: ItemCharacteristic;

  @Column({ unique: true, length: 3 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
