import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LeaveApplication } from '../leave-application/leave-application.entity';

@Entity()
export class LeaveApplicationDates extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'leave_application_id_fk' })
  @OneToMany(() => LeaveApplication, (leaveApplication) => leaveApplication.id)
  leaveApplicationId: LeaveApplication;

  @Column({ name: 'leave_date', type: 'date' })
  leaveDate: Date;
}
