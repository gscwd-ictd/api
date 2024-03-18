import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LspDetails } from '../lsp-details';
import { TrainingDetails } from '../training-details';

@Unique(['trainingDetails', 'lspDetails'])
@Entity({ name: 'training_lsp_details' })
export class TrainingLspDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'training_lsp_details_id' })
  id: string;

  @ManyToOne(() => TrainingDetails, (trainingDetails) => trainingDetails.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDetails;

  @ManyToOne(() => LspDetails, (lspDetails) => lspDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_details_id_fk' })
  lspDetails: LspDetails;
}
