import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseType } from '../purchase-type';

enum Status {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DISAPPROVED = 'Disapproved',
  CANCELLED = 'Cancelled',
}

@Entity('purchase_requests')
export class PurchaseRequest extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'pr_details_id' })
  id: string;

  @ManyToOne(() => PurchaseType, (type) => type.id, { nullable: false })
  @JoinColumn({ name: 'purchase_type_id_fk' })
  purchaseType: PurchaseType;

  // TODO decide on purchase request code format
  @Column({ unique: true })
  code: string;

  // TODO connect to finance
  @Column({ name: 'account_id', type: 'uuid' })
  accountId: string;

  // TODO connect to finance
  @Column({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @Column({ name: 'requesting_office', type: 'uuid' })
  requestingOffice: string;

  @Column({ type: 'text' })
  purpose: string;

  @Column({ name: 'place_of_delivery' })
  deliveryPlace: string;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;
}
