import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { ScheduleShift, ScheduleType } from '@gscwd-api/utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schedule')
export class Schedule extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'schedule_id' })
  id: string;

  @Column()
  name: string;

  @Column({ name: 'schedule_type', type: 'enum', enum: ScheduleType })
  scheduleType: ScheduleType;

  @Column({ name: 'time_in', type: 'time' })
  timeIn: string;

  @Column({ name: 'time_out', type: 'time' })
  timeOut: string;

  @Column({ name: 'lunch_in', type: 'time' })
  lunchIn: string;

  @Column({ name: 'lunch_out', type: 'time' })
  lunchOut: string;

  @Column({ type: 'enum', enum: ScheduleShift, nullable: true })
  shift: ScheduleShift;
}
