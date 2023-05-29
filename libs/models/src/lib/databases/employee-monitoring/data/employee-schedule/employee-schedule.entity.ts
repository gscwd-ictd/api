import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../schedule';

@Entity({ name: 'employee_schedule' })
export class EmployeeSchedule extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'employee_schedule_id' })
  id: string;

  @JoinColumn({ name: 'schedule_id_fk' })
  @ManyToOne(() => Schedule, (schedule) => schedule.id)
  scheduleId: Schedule;

  @Column({ name: 'employee_id_fk' })
  employeeId: string;

  @Column({ name: 'date_from', nullable: true })
  dateFrom: Date;

  @Column({ name: 'date_to', nullable: true })
  dateTo: Date;
}
