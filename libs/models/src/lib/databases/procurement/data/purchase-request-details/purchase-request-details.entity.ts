import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { PrStatus } from '@gscwd-api/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseType } from '../purchase-type';

@Entity('purchase_request_details')
export class PurchaseRequestDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'pr_details_id' })
  id: string;

  @ManyToOne(() => PurchaseType, (type) => type.id, { nullable: false })
  @JoinColumn({ name: 'purchase_type_id_fk' })
  purchaseType: PurchaseType;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'project_details_id', type: 'uuid' })
  projectDetailsId: string;

  @Column({ name: 'requesting_office', type: 'uuid' })
  requestingOffice: string;

  @Column({ type: 'text' })
  purpose: string;

  @Column({ name: 'place_of_delivery' })
  deliveryPlace: string;

  @Column({ type: 'enum', enum: PrStatus, default: PrStatus.PENDING })
  status: PrStatus;
}
