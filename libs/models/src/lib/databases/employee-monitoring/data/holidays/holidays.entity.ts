import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { HolidayType } from '@gscwd-api/utils';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
@Unique('holiday_name_ukey', ['name'])
@Entity('holidays')
export class Holidays extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'holiday_id' })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: HolidayType })
  type: HolidayType;

  @Column({ type: 'date', name: 'holiday_date' })
  holidayDate: Date;
}
