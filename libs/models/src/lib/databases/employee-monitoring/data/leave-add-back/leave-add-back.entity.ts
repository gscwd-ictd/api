import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { LeaveApplicationDates } from '../leave-application-dates';

@Entity({ name: 'leave_add_back' })
export class LeaveAddBack extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_add_back_id' })
  id: string;

  @JoinColumn({ name: 'leave_application_dates_id_fk' })
  @ManyToOne(() => LeaveApplicationDates, (lad) => lad.id)
  leaveApplicationDatesId: LeaveApplicationDates;

  @Column({ name: 'reason', type: 'text' })
  reason: string;

  @Column({ name: 'credit_value', type: 'decimal', scale: 2, precision: 3 })
  creditValue: number;
}
