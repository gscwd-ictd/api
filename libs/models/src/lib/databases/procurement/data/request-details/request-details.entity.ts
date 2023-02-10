import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pr_details')
export class PurchaseRequestDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'request_details_id' })
  id: string;

  @Column()
  code: string;

  @Column({ name: 'requesting_office' })
  requestingOffice: string;

  @Column({ type: 'text' })
  purpose: string;

  @Column()
  status: string;

  @Column({ name: 'place_of_delivery' })
  deliveryPlace: string;
}
