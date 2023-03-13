import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Contigency, ProjectDetails } from '@gscwd-api/models';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'equipment_costs' })
export class EquipmentCost extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'equipment_cost_id' })
  id: string;

  @ManyToOne(() => ProjectDetails, (projectDetail) => projectDetail.id, { nullable: false })
  @JoinColumn({ name: 'project_detail_id_fk' })
  projectDetail: ProjectDetails;

  @ManyToOne(() => Contigency, (contingency) => contingency.id, { nullable: false })
  @JoinColumn({ name: 'contigency_id_fk' })
  contingency: Contigency;

  @Column({ name: 'equipment_description', unique: true, type: 'text', nullable: true })
  equipmentDescription: string;

  @Column({ name: 'number_of_unit', type: 'integer' })
  numberOfUnit: number;

  @Column({ name: 'number_of_day', type: 'integer' })
  numberOfDays: number;

  @Column({ name: 'unit_cost', type: 'decimal' })
  unitCost: number;

  @Column({ name: 'amount', type: 'decimal' })
  amount: number;
}
