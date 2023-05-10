import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contigency } from '../contingencies/contingencies.entity';
import { ProjectDetails } from '../project-details';

@Entity({ name: 'material_costs' })
export class MaterialCost extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'material_cost_id' })
  id: string;

  @ManyToOne(() => ProjectDetails, (projectDetails) => projectDetails.id, { nullable: false })
  @JoinColumn({ name: 'project_details_id_fk' })
  projectDetails: ProjectDetails;

  @ManyToOne(() => Contigency, (contingency) => contingency.id, { nullable: true })
  @JoinColumn({ name: 'contigency_id_fk' })
  contingency: Contigency;

  @Column({ name: 'specification_id', type: 'uuid', nullable: false })
  specificationId: string;

  @Column({ name: 'quantity', type: 'integer' })
  quantity: number;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to(data: number): number {
        return data;
      },
      from(data: string): number {
        return parseFloat(data);
      },
    },
  })
  unitCost: number;
}
