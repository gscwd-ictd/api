import { DatabaseEntity, IEntity } from '@gscwd-api/entity';
import { ItemClassification } from 'apps/ims/src/api/item/components/classification';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectDetail } from '../../project-details';

@Entity({ name: 'material_costs' })
export class MaterialCost extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'material_cost_id' })
  id: string;

  @ManyToOne(() => ProjectDetail, (projectDetail) => projectDetail.id, { nullable: false })
  @JoinColumn({ name: 'project_detail_id_fk' })
  projectDetail: ProjectDetail;

  @ManyToOne(() => ItemClassification, (itemClassification) => itemClassification.id, { nullable: false })
  @JoinColumn({ name: 'classification_id_fk' })
  classification: ItemClassification;

  @Column({ name: 'quantity', type: 'integer' })
  quantity: number;

  @Column({ name: 'unit_cost', type: 'decimal' })
  unitCost: number;

  @Column({ name: 'amount', type: 'decimal' })
  amount: number;
}
