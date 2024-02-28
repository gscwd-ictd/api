import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LeaveApplication } from '../leave-application/leave-application.entity';
import { LeaveDayStatus } from '@gscwd-api/utils';

@Entity()
export class LeaveApplicationDates extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_application_date_id' })
  id: string;

  @JoinColumn({ name: 'leave_application_id_fk' })
  @ManyToOne(() => LeaveApplication, (leaveApplication) => leaveApplication.id)
  leaveApplicationId: LeaveApplication;

  @Column({ name: 'leave_date', type: 'date' })
  leaveDate: Date;

  @Column({ name: 'status', type: 'enum', enum: LeaveDayStatus })
  status: LeaveDayStatus;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;
}
