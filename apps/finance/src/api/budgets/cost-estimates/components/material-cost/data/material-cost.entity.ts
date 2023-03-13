import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectDetails } from '../../project-details';

@Entity({ name: 'material_costs' })
export class MaterialCost extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'material_cost_id' })
  id: string;

  @ManyToOne(() => ProjectDetails, (projectDetail) => projectDetail.id, { nullable: false })
  @JoinColumn({ name: 'project_detail_id_fk' })
  projectDetail: ProjectDetails;

  @Column({ name: 'specification_id_fk', type: 'uuid', nullable: false })
  specificationId: string;

  @Column({ name: 'quantity', type: 'integer' })
  quantity: number;

  @Column({ name: 'unit_cost', type: 'decimal' })
  unitCost: number;

  @Column({ name: 'amount', type: 'decimal' })
  amount: number;
}
