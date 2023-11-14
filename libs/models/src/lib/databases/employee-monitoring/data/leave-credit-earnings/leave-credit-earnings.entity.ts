import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { LeaveBenefits } from '../leave-benefits';
import { DailyTimeRecord } from '../daily-time-record';

@Entity('leave_credit_earnings')
export class LeaveCreditEarnings extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_credit_earnings_id' })
  id: string;

  @Column({ name: 'employee_id_fk', type: 'uuid' })
  employeeId: string;

  @JoinColumn({ name: 'leave_benefits_id_fk' })
  @ManyToOne(() => LeaveBenefits, (leaveBenefits) => leaveBenefits.id)
  leaveBenefitsId: LeaveBenefits;

  @JoinColumn({ name: 'daily_time_record_id_fk' })
  @ManyToOne(() => DailyTimeRecord, (dtr) => dtr.id)
  dailyTimeRecordId: DailyTimeRecord;

  @Column({ name: 'credit_date', type: 'date' })
  creditDate: Date;

  @Column({ name: 'credit_value', type: 'decimal', precision: 5, scale: 3 })
  creditValue: number;

  @Column({ name: 'remarks', type: 'text', default: null })
  remarks: string;
}
