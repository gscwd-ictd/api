import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseRequestDetails } from '../purchase-request-details';
import { RfqStatus } from '@gscwd-api/utils';

@Entity('request_for_quotations')
export class RequestForQuotation extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'rfq_details_id' })
  id: string;

  @ManyToOne(() => PurchaseRequestDetails, (prDetails) => prDetails.id, { nullable: false })
  @JoinColumn({ name: 'pr_details_id_fk' })
  prDetails: PurchaseRequestDetails;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'submit_within', type: 'integer', default: 7 })
  submitWithin: number;

  @Column({ type: 'enum', enum: RfqStatus, default: RfqStatus.FOR_CANVASS })
  status: RfqStatus;
}
