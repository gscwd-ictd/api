import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('purchase_requests')
export class PurchaseRequest extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'pr_details_id' })
  id: string;

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

  // TODO this is defined column -> shopping, svp, bidding
  @Column()
  type: string;

  // TODO this is a defined column -> pending, approved, disapproved, cancelled
  @Column({ default: 'Pending' })
  status: string;
}
