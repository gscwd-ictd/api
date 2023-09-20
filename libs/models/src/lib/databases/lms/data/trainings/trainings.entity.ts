import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingDesign } from '../training-designs';
import { TrainingDetails } from '../training-details';
import { TrainingSource } from '../training-sources';
import { TrainingStatus, TrainingType } from '@gscwd-api/utils';
import { LspDetails } from '../lsp-details';

@Entity({ name: 'trainings' })
export class Training extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_id' })
  id: string;

  @ManyToOne(() => TrainingDesign, (trainingDesign) => trainingDesign.id, { nullable: true })
  @JoinColumn({ name: 'training_design_id_fk' })
  trainingDesign: TrainingDesign;

  @ManyToOne(() => TrainingDetails, (trainingDetails) => trainingDetails.id, { nullable: true })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDetails;

  @ManyToOne(() => TrainingSource, (trainingSource) => trainingSource.id, { nullable: false })
  @JoinColumn({ name: 'training_source_id_fk' })
  trainingSource: TrainingSource;

  @Column({ name: 'training_type', type: 'enum', enum: TrainingType, nullable: false })
  trainingType: TrainingType;

  @ManyToOne(() => LspDetails, (lspDetails) => lspDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_details_id_fk' })
  lspDetails: LspDetails;

  @Column({ name: 'status', type: 'enum', enum: TrainingStatus, default: TrainingStatus.ON_GOING_NOMINATION, nullable: false })
  status: TrainingStatus;
}
