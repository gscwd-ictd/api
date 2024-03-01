import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DailyTimeRecord } from '../daily-time-record';
import { DtrCorrectionStatus } from '@gscwd-api/utils';

@Unique('dtr_correction_dtr_id_time_log_uk', ['dtrId'])
@Entity({ name: 'dtr_correction' })
export class DtrCorrection extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'dtr_correction_id' })
  id: string;

  @JoinColumn({ name: 'daily_time_record_id_fk' })
  @ManyToOne(() => DailyTimeRecord, (dtr) => dtr.id)
  dtrId: string;

  @Column({ name: 'time_in', type: 'time', nullable: true })
  timeIn: number;

  @Column({ name: 'lunch_out', type: 'time', nullable: true })
  lunchOut: number;

  @Column({ name: 'lunch_in', type: 'time', nullable: true })
  lunchIn: number;

  @Column({ name: 'time_out', type: 'time', nullable: true })
  timeOut: number;

  @Column({ name: 'status', type: 'enum', enum: DtrCorrectionStatus, default: DtrCorrectionStatus.FOR_APPROVAL })
  status: DtrCorrectionStatus;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;
}
