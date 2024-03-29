import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'employee_rest_day' })
export class EmployeeRestDay extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'employee_rest_day_id' })
  id: string;

  @Column({ name: 'employee_id_fk' })
  employeeId: string;

  @Column({ name: 'date_from', type: 'date', nullable: true })
  dateFrom: Date;

  @Column({ name: 'date_to', type: 'date', nullable: true })
  dateTo: Date;
}
