import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseRequest } from '../purchase-request';

enum Status {
  FOR_CANVASS = 'For Canvass',
  CANCELLED = 'Cancelled',
  CLOSED = 'Closed',
}

@Entity('request_for_quotations')
export class RequestForQuotation extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'rfq_details_id' })
  id: string;

  @ManyToOne(() => PurchaseRequest, (pr) => pr.id, { nullable: false })
  @JoinColumn({ name: 'pr_details_id_fk' })
  purchaseRequest: PurchaseRequest;

  // TODO decide on rfq code format
  @Column({ unique: true })
  code: string;

  @Column({ name: 'submit_within', type: 'integer', default: 7 })
  submitWithin: number;

  @Column({ type: 'enum', enum: Status, default: Status.FOR_CANVASS })
  status: Status;
}
