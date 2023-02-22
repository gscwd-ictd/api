import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('purchase_types')
export class PurchaseType extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'purchase_type_id' })
  id: string;

  @Column({ length: 30, unique: true })
  type: string;
}
