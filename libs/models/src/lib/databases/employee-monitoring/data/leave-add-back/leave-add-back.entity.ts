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

  @Column({ name: 'credit_value', type: 'decimal', scale: 3, precision: 6 })
  creditValue: number;

  /** WHOLE_DAY / TIME_OF_DAY work suspension that produced this row (idempotency + reversal). NULL for other rows. */
  @Column({ name: 'work_suspension_id_fk', type: 'uuid', nullable: true, default: null })
  workSuspensionId: string | null;
}
