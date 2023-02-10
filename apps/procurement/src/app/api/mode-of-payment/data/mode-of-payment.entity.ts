import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'mode-of-payment' })
export class ModeofPayment extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'mode_of_payment_id' })
  id: string;

  @Column({ type: 'text', unique: true })
  description: string;
}
