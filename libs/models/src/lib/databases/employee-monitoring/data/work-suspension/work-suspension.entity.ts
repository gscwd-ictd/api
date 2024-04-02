import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique('name_date_time_uk', ['name', 'suspensionDate'])
@Entity({ name: 'work_suspension' })
export class WorkSuspension extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'work_suspension_id' })
  id: string;

  @Column({ name: 'work_suspension_name' })
  name: string;

  @Column({ name: 'suspension_date', type: 'date' })
  suspensionDate: Date;

  @Column({ name: 'suspension_hours', type: 'decimal', scale: 2, precision: 3 })
  suspensionHours: number;
}
