import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { LeaveApplication } from '../leave-application';
import { PassSlip } from '../pass-slip';
import { DailyTimeRecord } from '../daily-time-record';
import { LeaveBenefits } from '../leave-benefits';
import { LeaveCreditDeductions } from '../leave-credit-deductions';
import { DtrDeductionType } from '@gscwd-api/utils';

/** a pass slip has at most one ledger debit (two cron runs at the same time posted 15 slips twice in Oct 2026) */
@Index('uq_ledger_debit_pass_slip', ['passSlipId'], { unique: true })
/** one tardiness / undertime / half day debit per DTR row, for debits created from 2026 onward */
@Index('uq_ledger_debit_dtr_type', ['uniqueDtrDebitKey'], { unique: true })
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

  @Column({ name: 'dtr_deduction_type', type: 'enum', nullable: true, enum: DtrDeductionType })
  dtrDeductionType: DtrDeductionType;

  /** Leave type decided at posting time (Wellness Pass). NULL = sp_generate_leave_ledger_view applies its usual rules. */
  @Column({ name: 'leave_type_charged', type: 'enum', enum: ['VL', 'SL'], nullable: true, default: null })
  leaveTypeCharged: 'VL' | 'SL' | null;

  /** computed: 'dtr id|deduction type' for DTR debits created from 2026 onward, NULL otherwise -> uq_ledger_debit_dtr_type */
  @Column({
    name: 'unique_dtr_debit_key',
    type: 'varchar',
    length: 100,
    nullable: true,
    generatedType: 'STORED',
    asExpression:
      "IF(`daily_time_record_id_fk` IS NOT NULL AND `created_at` >= '2026-01-01', CONCAT(`daily_time_record_id_fk`, '|', IFNULL(`dtr_deduction_type`, 'Tardiness')), NULL)",
    select: false,
    insert: false,
    update: false,
  })
  uniqueDtrDebitKey?: string;
}
