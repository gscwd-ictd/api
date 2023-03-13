import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LaborType } from '../../labor-type';
import { ProjectDetails } from '../../project-details';

@Entity({ name: 'labor_costs' })
export class LaborCost extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'labor_cost_id' })
  id: string;

  @ManyToOne(() => ProjectDetails, (projectDetail) => projectDetail.id, { nullable: false })
  @JoinColumn({ name: 'project_detail_id_fk' })
  projectDetail: ProjectDetails;

  @ManyToOne(() => LaborType, (laborType) => laborType.id, { nullable: false })
  @JoinColumn({ name: 'labor_type_id_fk' })
  laborType: LaborType;

  @Column({ name: 'number_of_person', type: 'integer' })
  numberOfPerson: number;

  @Column({ name: 'number_of_day', type: 'integer' })
  numberOfDay: number;

  @Column({ name: 'unit_cost', type: 'decimal' })
  unitCost: number;

  @Column({ name: 'amount', type: 'decimal' })
  amount: number;
}
