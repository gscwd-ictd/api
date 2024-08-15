import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { OvertimeStatus } from '@gscwd-api/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OvertimeImmediateSupervisor } from '../overtime-immediate-supervisor';

@Entity({ name: 'overtime_application' })
export class OvertimeApplication extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'overtime_application_id' })
  id: string;

  @JoinColumn({ name: 'overtime_immediate_supervisor_id_fk' })
  @ManyToOne(() => OvertimeImmediateSupervisor, (overtimeImmediateSupervisor) => overtimeImmediateSupervisor.id)
  overtimeImmediateSupervisorId: OvertimeImmediateSupervisor;

  @Column({ name: 'manager_id_fk', type: 'uuid', nullable: true })
  managerId: string;

  @Column({ name: 'planned_date', type: 'date', nullable: true })
  plannedDate: Date;

  @Column({ name: 'estimated_hours', type: 'decimal', precision: 4, scale: 2 })
  estimatedHours: number;

  @Column({ name: 'purpose', type: 'text' })
  purpose: string;

  @Column({ name: 'status', type: 'enum', enum: OvertimeStatus, default: OvertimeStatus.PENDING })
  status: OvertimeStatus;
}
