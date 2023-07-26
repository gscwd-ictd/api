import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { LeaveAddBack } from '../leave-add-back/leave-add-back.entity';
import { LeaveCreditEarnings } from '../leave-credit-earnings';

@Entity()
export class LeaveCardLedgerCredit extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_card_ledger_credit_id' })
  id: string;

  @JoinColumn({ name: 'leave_add_back_id_fk' })
  @ManyToOne(() => LeaveAddBack, (leaveAddBack) => leaveAddBack.id)
  leaveAddBackId: LeaveAddBack;

  @JoinColumn({ name: 'leave_credit_earning_id_fk' })
  @ManyToOne(() => LeaveCreditEarnings, (leaveCreditEarnings) => leaveCreditEarnings.id)
  leaveCreditEarningId: LeaveCreditEarnings;
}
