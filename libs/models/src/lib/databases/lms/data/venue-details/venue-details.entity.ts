import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('venue_details')
export class VenueDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'venue_details_id' })
  id: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ length: 100 })
  address: string;

  @Column({ name: 'contact_number', length: 11 })
  contactNumber: string;

  @Column({ name: 'contact_person', length: 100 })
  contactPerson: string;

  @Column({ length: 100 })
  email: string;
}
