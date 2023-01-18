import { DatabaseEntity, IEntity } from '@gscwd-api/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectDetail } from '../../project-detail';

@Entity({ name: 'contractors-profit' })
export class ContractorProfit extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'contractor_profit_id' })
  id: string;

  @ManyToOne(() => ProjectDetail, (projectDetail) => projectDetail.id, { nullable: false })
  @JoinColumn({ name: 'project_detail_id_fk' })
  projectDetail: ProjectDetail;

  @Column({ name: 'percentage', type: 'integer' })
  percentage: number;
}
