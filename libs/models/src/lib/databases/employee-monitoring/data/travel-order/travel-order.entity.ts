import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'travel_order' })
export class TravelOrder extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'travel_order_id' })
  id: string;

  @Column({ name: 'date_requested', type: 'date', nullable: true })
  dateRequested: Date;

  @Column({ name: 'employee_id_fk' })
  employeeId: string;

  @Column({ name: 'purpose_of_travel', type: 'text' })
  purposeOfTravel: string;

  @Column({ name: 'travel_order_no' })
  travelOrderNo: string;

  @Column({ name: 'is_ptr_required', nullable: true })
  isPtrRequired: boolean;
}
