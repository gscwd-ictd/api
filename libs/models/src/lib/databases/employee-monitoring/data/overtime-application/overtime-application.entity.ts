import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { OvertimeStatus } from '@gscwd-api/utils';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OvertimeImmediateSupervisor } from '../overtime-immediate-supervisor';

@Entity({ name: 'overtime_application' })
export class OvertimeApplication extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn({ name: 'overtime_application_id' })
  id: string;

  @ManyToOne(() => OvertimeImmediateSupervisor, (overtimeImmediateSupervisor) => overtimeImmediateSupervisor.id)
  overtimeImmediateSupervisorId: OvertimeImmediateSupervisor;

  @Column({ name: 'planned_date', type: 'date' })
  plannedDate: string;

  @Column({ name: 'estimated_hours', type: 'int' })
  estimatedHours: number;

  @Column({ name: 'purpose', type: 'text' })
  purpose: string;

  @Column({ name: 'status', type: 'enum', enum: OvertimeStatus, default: OvertimeStatus.PENDING })
  status: OvertimeStatus;
}
