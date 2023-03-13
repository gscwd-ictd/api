import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Contigency, ProjectDetails } from '@gscwd-api/models';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'labor_costs' })
export class LaborCost extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'labor_cost_id' })
  id: string;

  @ManyToOne(() => ProjectDetails, (projectDetail) => projectDetail.id, { nullable: false })
  @JoinColumn({ name: 'project_detail_id_fk' })
  projectDetail: ProjectDetails;

  @ManyToOne(() => Contigency, (contingency) => contingency.id, { nullable: false })
  @JoinColumn({ name: 'contigency_id_fk' })
  contingency: Contigency;

  @Column({ name: 'specification_id', type: 'uuid', nullable: false })
  specificationId: string;

  @Column({ name: 'number_of_person', type: 'integer' })
  numberOfPerson: number;

  @Column({ name: 'number_of_days', type: 'integer' })
  numberOfDays: number;

  @Column({ name: 'unit_cost', type: 'decimal' })
  unitCost: number;

  @Column({ name: 'amount', type: 'decimal' })
  amount: number;
}
