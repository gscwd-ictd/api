import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { OvertimeStatus } from '@gscwd-api/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OvertimeEmployee } from '../overtime-employee';

@Entity({
  name: 'overtime_accomplishment',
})
export class OvertimeAccomplishment extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'overtime_accomplishment' })
  id: string;

  @JoinColumn({ name: 'overtime_employee_id_fk' })
  @ManyToOne(() => OvertimeEmployee, (overtimeEmployee) => overtimeEmployee.id)
  overtimeEmployeeId: OvertimeEmployee;

  @Column({ name: 'ivms_time_in', type: 'time', default: null })
  ivmsTimeIn: number;

  @Column({ name: 'ivms_time_out', type: 'time', default: null })
  ivmsTimeOut: number;

  @Column({ name: 'encoded_time_in', type: 'time', default: null })
  encodedTimeIn: number;

  @Column({ name: 'encoded_time_out', type: 'time', default: null })
  encodedTimeOut: number;

  @Column({ type: 'text', default: null })
  accomplishments: string;

  @Column({ name: 'approved_hours', type: 'decimal', scale: 2, precision: 4, nullable: true })
  approvedHours: number;

  @Column({ name: 'follow_estimated_hrs', type: 'boolean', default: null })
  followEstimatedHrs: boolean;

  @Column({ name: 'approved_hours', type: 'decimal', scale: 2, precision: 4, nullable: true })
  approvedHours: number;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'enum', enum: OvertimeStatus, default: OvertimeStatus.PENDING })
  status: OvertimeStatus;
}
