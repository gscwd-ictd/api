import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('item_characteristics')
export class ItemCharacteristic extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'characteristic_id' })
  id: string;

  @Column({ unique: true, length: 3 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
