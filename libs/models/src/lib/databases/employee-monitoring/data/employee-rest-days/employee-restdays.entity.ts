import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { RestDays } from '@gscwd-api/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeeRestDay } from '../employee-rest-day/employee-rest-day.entity';

@Entity()
export class EmployeeRestDays extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'employee_rest_days_id' })
  id: string;

  @JoinColumn({ name: 'employee_rest_day_id_fk' })
  @ManyToOne(() => EmployeeRestDay, (empoyeeRestDay) => empoyeeRestDay.id)
  employeeRestDayId: EmployeeRestDay;

  @Column({ name: 'rest_day', type: 'enum', enum: RestDays })
  restDay: RestDays;
}
