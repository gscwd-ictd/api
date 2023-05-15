import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DailyTimeRecord extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'daily_time_record_id' })
  id: string;

  @Column({ name: 'company_id_fk' })
  companyId: string;

  @Column({ name: 'dtr_date', type: 'date' })
  dtrDate: Date;

  @Column({ name: 'time_in', type: 'time' })
  timeIn: number;

  @Column({ name: 'lunch_out', type: 'time' })
  lunchOut: number;

  @Column({ name: 'lunch_in', type: 'time' })
  lunchIn: number;

  @Column({ name: 'time_out', type: 'time' })
  timeOut: number;
}
