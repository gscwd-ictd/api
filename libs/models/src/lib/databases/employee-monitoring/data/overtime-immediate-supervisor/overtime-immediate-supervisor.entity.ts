import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'overtime_immediate_supervisor' })
export class OvertimeImmediateSupervisor extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'overtime_immediate_supervisor' })
  id: string;

  @Column({ name: 'employee_id_fk', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'org_id_fk', type: 'uuid' })
  orgId: string;
}
