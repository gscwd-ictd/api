import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { ProjectDetails } from '@gscwd-api/models';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contigency } from '../contingencies/contingencies.entity';

@Entity({ name: 'material_costs' })
export class MaterialCost extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'material_cost_id' })
  id: string;

  @ManyToOne(() => ProjectDetails, (projectDetails) => projectDetails.id, { nullable: false })
  @JoinColumn({ name: 'project_details_id_fk' })
  projectDetails: ProjectDetails;

  @ManyToOne(() => Contigency, (contingency) => contingency.id, { nullable: false })
  @JoinColumn({ name: 'contigency_id_fk' })
  contingency: Contigency;

  @Column({ name: 'specification_id', type: 'uuid', nullable: false })
  specificationId: string;

  @Column({ name: 'quantity', type: 'integer' })
  quantity: number;

  @Column({ name: 'unit_cost', type: 'decimal' })
  unitCost: number;

  @Column({ name: 'amount', type: 'decimal' })
  amount: number;
}
