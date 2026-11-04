import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TravelOrder } from '../travel-order/travel-order.entity';

@Index('IDX_toi_schedule_date', ['scheduleDate'])
@Entity()
export class TravelOrderItinerary extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'travel_order_places_id' })
  id: string;

  @ManyToOne(() => TravelOrder, (travelOrder) => travelOrder.id)
  @JoinColumn({ name: 'travel_order_id_fk' })
  travelOrderId: TravelOrder;

  @Column({ name: 'schedule_date', type: 'date' })
  scheduleDate: Date;

  @Column({ name: 'schedule_place' })
  schedulePlace: string;
}
