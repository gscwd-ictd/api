import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseRequestDetails } from '../request-details';

@Entity('requested_items')
export class RequestedItem extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'requested_item_id' })
  id: string;

  @ManyToOne(() => PurchaseRequestDetails, (purchaseRequest) => purchaseRequest.id)
  @JoinColumn({ name: 'request_details_id_fk' })
  details: PurchaseRequestDetails;

  @Column({ name: 'item_id', type: 'uuid', unique: true })
  itemId: string;

  @Column({ name: 'requested_quantity', type: 'integer' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;
}
