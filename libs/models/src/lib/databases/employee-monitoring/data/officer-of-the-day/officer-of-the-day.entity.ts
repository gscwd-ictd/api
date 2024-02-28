import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique('employee_org_date_from_date_to_uk', ['employeeId', 'orgId', 'dateFrom', 'dateTo'])
@Entity('officer_of_the_day')
export class OfficerOfTheDay extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'officer_of_the_day_id' })
  id: string;

  @Column({ name: 'employee_id_fk', type: 'uuid', nullable: true })
  employeeId: string;

  @Column({ name: 'org_id_fk', type: 'uuid' })
  orgId: string;

  @Column({ name: 'date_from', type: 'date' })
  dateFrom: Date;

  @Column({ name: 'date_to', type: 'date' })
  dateTo: Date;
}
