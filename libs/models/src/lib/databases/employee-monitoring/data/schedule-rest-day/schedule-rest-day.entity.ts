import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { RestDays } from '@gscwd-api/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Schedule } from '../schedule/schedule.entity';

@Unique('rest_day_uk', ['restDay', 'scheduleId'])
@Entity('schedule_rest_day')
export class ScheduleRestDay extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'schedule_rest_day_id' })
  id: string;

  @JoinColumn({ name: 'schedule_id_fk' })
  @ManyToOne(() => Schedule, (schedule) => schedule.id)
  scheduleId: Schedule;

  @Column({ name: 'rest_day', type: 'enum', enum: RestDays })
  restDay: RestDays;
}
