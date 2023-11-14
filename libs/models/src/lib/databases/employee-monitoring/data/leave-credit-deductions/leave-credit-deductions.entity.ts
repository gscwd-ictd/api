import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LeaveBenefits } from '../leave-benefits';

@Entity({ name: 'leave_credit_deductions' })
export class LeaveCreditDeductions extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_credit_deductions_id' })
  id: string;

  @Column({ name: 'employee_id_fk', type: 'uuid' })
  employeeId: string;

  @JoinColumn({ name: 'leave_benefits_id_fk' })
  @ManyToOne(() => LeaveBenefits, (leaveBenefits) => leaveBenefits.id)
  leaveBenefitsId: LeaveBenefits;

  @Column({ name: 'debit_value', type: 'decimal', precision: 6, scale: 3 })
  debitValue: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;
}
