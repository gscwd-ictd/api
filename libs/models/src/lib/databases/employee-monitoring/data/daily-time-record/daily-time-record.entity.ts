import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../schedule';

@Entity()
@Index('IDX_dtr_company_date', ['companyId', 'dtrDate'])
/** one DTR row per employee per day from 2026 onward (older duplicate rows are kept as they are) */
@Index('uq_dtr_company_day', ['uniqueDayKey'], { unique: true })
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

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string;

  /** computed: 'company|date' for 2026 onward, NULL before -> unique key uq_dtr_company_day */
  @Column({
    name: 'unique_day_key',
    type: 'varchar',
    length: 300,
    nullable: true,
    generatedType: 'STORED',
    asExpression: "IF(`dtr_date` >= '2026-01-01', CONCAT(`company_id_fk`, '|', `dtr_date`), NULL)",
    select: false,
    insert: false,
    update: false,
  })
  uniqueDayKey?: string;
}
