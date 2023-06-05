import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreditDistribution, LeaveTypes } from '@gscwd-api/utils';

@Entity('leave_benefits')
export class LeaveBenefits extends DatabaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_benefits_id' })
  id: string;

  @Column({ name: 'leave_name' })
  leaveName: string;

  @Column({ name: 'leave_types', type: 'enum', enum: LeaveTypes })
  leaveType: LeaveTypes;

  @Column({ name: 'accumulated_credits', type: 'decimal', precision: 3, scale: 2, nullable: true })
  accumulatedCredits: number;

  @Column({ name: 'credit_distribution', type: 'enum', enum: CreditDistribution, nullable: true })
  creditDistribution: CreditDistribution;

  @Column({ name: 'monetizable' })
  isMonetizable: boolean;

  @Column({ name: 'can_be_carried_over' })
  canBeCarriedOver: boolean;
}
