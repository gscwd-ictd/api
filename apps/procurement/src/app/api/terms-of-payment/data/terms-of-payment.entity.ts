import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ModeofPayment } from '../../mode-of-payment';

@Entity({ name: 'terms_of_payment' })
export class TermsofPayment extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'terms_of_payment_id' })
  id: string;

  @ManyToOne(() => ModeofPayment, (modeOfPayment) => modeOfPayment.id, { nullable: false })
  @JoinColumn({ name: 'mode_of_payment_id_fk' })
  modeofPaymentID: ModeofPayment;

  @Column({ name: 'no_of_days', type: 'integer' })
  noOfDays: number;
}
