import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { LeaveApplication } from '../leave-application';
import { PassSlip } from '../pass-slip';
import { DailyTimeRecord } from '../daily-time-record';
import { LeaveBenefits } from '../leave-benefits';
import { LeaveCreditDeductions } from '../leave-credit-deductions';

@Entity()
export class LeaveCardLedgerDebit extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_card_ledger_id' })
  id: string;

  @JoinColumn({ name: 'leave_application_id_fk' })
  @ManyToOne(() => LeaveApplication, (leaveApplication) => leaveApplication.id)
  leaveApplicationId: LeaveApplication;

  @JoinColumn({ name: 'pass_slip_id_fk' })
  @ManyToOne(() => PassSlip, (passSlip) => passSlip.id)
  passSlipId: PassSlip;

  @JoinColumn({ name: 'daily_time_record_id_fk' })
  @ManyToOne(() => DailyTimeRecord, (dailyTimeRecord) => dailyTimeRecord.id)
  dailyTimeRecordId: DailyTimeRecord;

  @JoinColumn({ name: 'leave_credit_deductions_id_fk' })
  @ManyToOne(() => LeaveCreditDeductions, (leaveCreditDeductions) => leaveCreditDeductions.id)
  leaveCreditDeductionsId: LeaveCreditDeductions;

  @Column({ name: 'debit_value', type: 'decimal', scale: 3, precision: 6 })
  debitValue: number;
}
