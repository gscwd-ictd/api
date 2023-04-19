import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BudgetDetails } from '../budget-details';

@Entity({ name: 'project_details' })
export class ProjectDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'project_details_id' })
  id: string;

  @ManyToOne(() => BudgetDetails, (budgetDetails) => budgetDetails.id, { nullable: false })
  @JoinColumn({ name: 'budget_details_id_fk' })
  budgetDetails: BudgetDetails;

  @Column({ name: 'project_name', nullable: true })
  projectName: string;

  @Column({ name: 'location', type: 'text', nullable: true })
  location: string;

  @Column({ name: 'subject', nullable: true })
  subject: string;

  @Column({ name: 'work_description', type: 'text', nullable: true })
  workDescription: string;

  @Column({ name: 'quantity', nullable: true })
  quantity: number;

  @Column({ name: 'unit_measurement', type: 'varchar', nullable: true })
  unitMeasurement: string;

  @Column({ name: 'output_per_day' })
  outputPerDay: string;
}
