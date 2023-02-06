import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LeaveApplication } from '../leave-application/leave-application.entity';

@Entity()
export class LeaveApplicationDates extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'leave_application_date_id' })
  id: string;

  @JoinColumn({ name: 'leave_application_id_fk' })
  @ManyToOne(() => LeaveApplication, (leaveApplication) => leaveApplication.id)
  leaveApplicationId: string;

  @Column({ name: 'leave_date', type: 'date' })
  leaveDate: Date;
}
