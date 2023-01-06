import { DatabaseEntity, IEntity } from '@gscwd-api/entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectDetail } from '../../project-details';

@Entity({ name: 'labor_costs' })
export class LaborCost extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'labor_cost_id' })
  id: string;

  @ManyToOne(() => ProjectDetail, (projectDetail) => projectDetail.id, { nullable: false })
  @JoinColumn({ name: 'project_detail_id_fk' })
  projectDetail: ProjectDetail;

  @Column({ name: 'number_of_person', type: 'integer' })
  numberOfPerson: number;

  @Column({ name: 'number_of_day', type: 'integer' })
  numberOfDay: number;

  @Column({ name: 'unit_cost', type: 'decimal' })
  unitCost: number;

  @Column({ name: 'amount', type: 'decimal' })
  amount: number;
}
