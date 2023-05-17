import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { VenueDetails } from '../venue-details';

@Entity('venue_facilities')
@Unique(['venueDetails', 'name'])
export class VenueFacility extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'venue_facility_id' })
  id: string;

  @ManyToOne(() => VenueDetails, (venueDetails) => venueDetails.id, { nullable: false })
  @JoinColumn({ name: 'venue_details_id_fk' })
  venueDetails: VenueDetails;

  @Column({ length: 100 })
  name: string;

  @Column({
    name: 'cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to(data: number): number {
        return data;
      },
      from(data: string): number {
        return parseFloat(data);
      },
    },
  })
  cost: number;

  @Column({ name: 'maximum_pax' })
  maximumPax: number;
}
