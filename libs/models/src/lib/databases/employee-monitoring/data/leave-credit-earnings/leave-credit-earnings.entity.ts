import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { LeaveBenefits } from '../leave-benefits';

@Entity('leave_credit_earnings')
export class LeaveCreditEarnings extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_credit_earnings_id' })
  id: string;

  @Column({ name: 'employee_id_fk', type: 'uuid' })
  employeeId: string;

  @JoinColumn({ name: 'leave_benefits_id_fk' })
  @ManyToOne(() => LeaveBenefits, (leaveBenefits) => leaveBenefits.id)
  leaveBenefitsId: LeaveBenefits;

  @Column({ name: 'credit_date', type: 'date' })
  creditDate: Date;

  @Column({ name: 'credit_value', type: 'decimal', precision: 5, scale: 3 })
  creditValue: number;
}
