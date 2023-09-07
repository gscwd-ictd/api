import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OvertimeApplication } from '../overtime-application';

@Entity('overtime_approval')
export class OvertimeApproval extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'overtime_approval_id' })
  id: string;

  @JoinColumn({ name: 'overtime_application_id_fk' })
  @ManyToOne(() => OvertimeApplication, (overtimeApplication) => overtimeApplication.id)
  overtimeApplicationId: OvertimeApplication;

  @Column({ name: 'date_approved' })
  dateApproved: Date;

  @Column({ name: 'manager_id_fk', type: 'uuid' })
  managerId: string;

  @Column({ name: 'remarks', type: 'text' })
  remarks: string;
}
