import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TrainingDetails } from '../training-details';
import { LspOrganizationDetails } from '../lsp-organization-details';

@Entity('training_lsp_organization')
@Unique(['trainingDetails', 'lspOrganizationDetails'])
export class TrainingLspOrganization {
  @PrimaryGeneratedColumn('uuid', { name: 'training_lsp_organization_id' })
  id: string;

  @ManyToOne(() => TrainingDetails, (trainingDetails) => trainingDetails.id, { nullable: false })
  @JoinColumn({ name: 'training_details_id_fk' })
  trainingDetails: TrainingDetails;

  @ManyToOne(() => LspOrganizationDetails, (lspOrganizationDetails) => lspOrganizationDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_organization_details_id_fk' })
  lspOrganizationDetails: LspOrganizationDetails;
}
