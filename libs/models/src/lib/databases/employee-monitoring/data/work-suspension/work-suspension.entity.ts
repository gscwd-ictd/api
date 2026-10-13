import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum WorkSuspensionType {
  /** whole duty day is suspended (from schedule time in, capped at 12:00 midnight) */
  WHOLE_DAY = 'WHOLE_DAY',
  /** suspended from suspension_start_time until 12:00 midnight */
  TIME_OF_DAY = 'TIME_OF_DAY',
  /** entries created before the rework; computed with the old suspension_hours rules */
  LEGACY = 'LEGACY',
}

@Unique('name_date_time_uk', ['name', 'suspensionDate'])
@Index('work_suspension_date_idx', ['suspensionDate'])
@Entity({ name: 'work_suspension' })
export class WorkSuspension extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'work_suspension_id' })
  id: string;

  @Column({ name: 'work_suspension_name' })
  name: string;

  @Column({ name: 'suspension_date', type: 'date' })
  suspensionDate: Date;

  /** existing rows default to LEGACY so schema sync does not change how they are computed */
  @Column({ name: 'suspension_type', type: 'enum', enum: WorkSuspensionType, default: WorkSuspensionType.LEGACY })
  suspensionType: WorkSuspensionType;

  /** required for TIME_OF_DAY, null otherwise (HH:mm:ss) */
  @Column({ name: 'suspension_start_time', type: 'time', nullable: true, default: null })
  suspensionStartTime: string | null;

  /** LEGACY rows only; new entries do not use hours */
  @Column({ name: 'suspension_hours', type: 'decimal', scale: 2, precision: 3, nullable: true, default: null })
  suspensionHours: number | null;

  @Column({ name: 'is_archived', type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ name: 'memo_no', type: 'varchar', length: 100, nullable: true, default: null })
  memoNo: string | null;

  @Column({ name: 'remarks', type: 'text', nullable: true, default: null })
  remarks: string | null;
}
