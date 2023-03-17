import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contigency } from '../contingencies';
import { ProjectDetails } from '../project-details';

@Entity({ name: 'labor_costs' })
export class LaborCost extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'labor_cost_id' })
  id: string;

  @ManyToOne(() => ProjectDetails, (projectDetails) => projectDetails.id, { nullable: false })
  @JoinColumn({ name: 'project_details_id_fk' })
  projectDetails: ProjectDetails;

  @ManyToOne(() => Contigency, (contingency) => contingency.id, { nullable: true })
  @JoinColumn({ name: 'contigency_id_fk' })
  contingency: Contigency;

  @Column({ name: 'specification_id', type: 'uuid', nullable: false })
  specificationId: string;

  @Column({ name: 'number_of_person', type: 'integer' })
  numberOfPerson: number;

  @Column({ name: 'number_of_days', type: 'integer' })
  numberOfDays: number;

  @Column({ name: 'unit_cost', type: 'integer' })
  unitCost: number;
}
