import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity } from '@gscwd-api/entity';

@Entity('item_characteristics')
export class ItemCharacteristic extends DatabaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'characteristic_id' })
  characteristicId: string;

  @Column({ unique: true, length: 3 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
