import { IEntity } from '@gscwd-api/crud';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectDetails } from '../project-details';

@Entity({ name: 'value_added_tax' })
export class ValueAddedTax extends BaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'value_added_tax_id' })
  id: string;

  @ManyToOne(() => ProjectDetails, (projectDetails) => projectDetails.id, { nullable: false })
  @JoinColumn({ name: 'project_details_id_fk' })
  projectDetails: ProjectDetails;

  @Column({ name: 'percentage', type: 'integer', default: 5 })
  percentage: number;
}
