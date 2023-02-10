import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'terms_of_payment' })
export class TermsofPayment extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'terms_of_payment_id' })
  id: string;

  @Column({ name: 'no_of_days', type: 'integer' })
  noOfDays: number;
}
