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

  @Column({ name: 'ivms_time_in', type: 'time' })
  ivmsTimeIn: number;

  @Column({ name: 'ivms_time_out', type: 'time' })
  ivmsTimeOut: number;

  @Column({ name: 'encoded_time_in', type: 'time' })
  encodedTimeIn: number;

  @Column({ name: 'encoded_time_out', type: 'time' })
  encodedTimeOut: number;

  @Column({ type: 'text' })
  accomplishments: string;

  @Column({ name: 'follow_estimated_hrs', type: 'boolean' })
  followEstimatedHrs: boolean;

  @Column({ type: 'enum', enum: OvertimeStatus, default: OvertimeStatus.PENDING })
  status: OvertimeStatus;
}
