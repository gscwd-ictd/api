import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OvertimeApplication } from '../overtime-application';

@Entity('overtime_employee')
@Index(['overtimeApplicationId', 'employeeId'], { unique: true })
export class OvertimeEmployee extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'overtime_employee_id' })
  id: string;

  @JoinColumn({ name: 'overtime_application_id_fk' })
  @ManyToOne(() => OvertimeApplication, (overtimeApplication) => overtimeApplication.id)
  overtimeApplicationId: OvertimeApplication;

  @Column({ name: 'employee_id_fk', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'is_read', type: 'boolean', default: null })
  isRead: boolean;
}
