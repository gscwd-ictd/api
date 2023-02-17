import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PurchaseRequest } from '../purchase-request';
import { RequestForQuotation } from '../request-for-quotation';

@Entity('requested_items')
@Unique(['purchaseRequest', 'itemId'])
export class RequestedItem extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'requested_item_id' })
  id: string;

  @ManyToOne(() => PurchaseRequest, (pr) => pr.id, { nullable: false })
  @JoinColumn({ name: 'pr_details_id_fk' })
  purchaseRequest: PurchaseRequest;

  @ManyToOne(() => RequestForQuotation, (rfq) => rfq.id)
  @JoinColumn({ name: 'rfq_details_id_fk' })
  requestForQuotation: RequestForQuotation;

  @Column({ name: 'item_id', type: 'uuid' })
  itemId: string;

  @Column({ name: 'requested_quantity', type: 'integer' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;
}
