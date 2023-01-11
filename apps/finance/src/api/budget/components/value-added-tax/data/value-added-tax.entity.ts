import { IEntity } from '@gscwd-api/entities';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectDetail } from '../../project-detail';

@Entity({ name: 'value_added_tax' })
export class ValueAddedTax extends BaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'value_added_tax_id' })
  id: string;

  @ManyToOne(() => ProjectDetail, (projectDetail) => projectDetail.id, { nullable: false })
  @JoinColumn({ name: 'project_detail_id_fk' })
  projectDetail: ProjectDetail;

  @Column({ name: 'percentage', type: 'integer' })
  percentage: number;
}
