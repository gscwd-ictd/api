import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../schedule';

@Entity()
export class DailyTimeRecord extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'daily_time_record_id' })
  id: string;

  @Column({ name: 'company_id_fk' })
  companyId: string;

  @Column({ name: 'dtr_date', type: 'date' })
  dtrDate: Date;

  @Column({ name: 'time_in', type: 'time', nullable: true })
  timeIn: number;

  @Column({ name: 'lunch_out', type: 'time', nullable: true })
  lunchOut: number;

  @Column({ name: 'lunch_in', type: 'time', nullable: true })
  lunchIn: number;

  @Column({ name: 'time_out', type: 'time', nullable: true })
  timeOut: number;

  @JoinColumn({ name: 'schedule_id_fk' })
  @ManyToOne(() => Schedule, (schedule) => schedule.id)
  scheduleId: Schedule;

  @Column({ name: 'has_correction', type: 'boolean', nullable: true })
  hasCorrection: boolean;
}
