import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { MonetizationType } from '@gscwd-api/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LeaveApplication } from '../leave-application';

@Entity({ name: 'leave_monetization' })
export class LeaveMonetization extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_monetization_id' })
  id: string;

  @Column({ name: 'monetization_type', type: 'enum', enum: MonetizationType })
  monetizationType: MonetizationType;

  @Column({ name: 'converted_vl', type: 'int' })
  convertedVl: number;

  @Column({ name: 'converted_sl', type: 'int' })
  convertedSl: number;

  @JoinColumn({ name: 'leave_application_id_fk' })
  @ManyToOne(() => LeaveApplication, (leaveApplication) => leaveApplication.id)
  leaveApplicationId: LeaveApplication;

  @Column({ name: 'monetizated_amount' })
  monetizedAmount: number;
}
