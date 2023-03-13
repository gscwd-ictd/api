import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectDetails } from '../project-details';

@Entity({ name: 'contingencies' })
export class Contigency extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'contigency_id' })
  id: string;

  @ManyToOne(() => ProjectDetails, (projectDetails) => projectDetails.id, { nullable: false })
  @JoinColumn({ name: 'project_details_id_fk' })
  projectDetails: ProjectDetails;
}
