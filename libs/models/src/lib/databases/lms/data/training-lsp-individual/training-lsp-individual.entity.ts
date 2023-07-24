import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TrainingDetails } from '../training-details';
import { LspIndividualDetails } from '../lsp-individual-details';

@Entity('training_lsp_individual')
@Unique(['trainingDetails', 'lspIndividualDetails'])
export class TrainingLspIndividual {
  @PrimaryGeneratedColumn('uuid', { name: 'training_lsp_individual_id' })
  id: string;

  @ManyToOne(() => TrainingDetails, (trainingDetails) => trainingDetails.id, { nullable: false })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDetails;

  @ManyToOne(() => LspIndividualDetails, (lspIndividualDetails) => lspIndividualDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_individual_details_id_fk' })
  lspIndividualDetails: LspIndividualDetails;
}
