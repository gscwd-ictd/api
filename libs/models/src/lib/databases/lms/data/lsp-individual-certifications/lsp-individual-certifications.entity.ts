import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LspIndividualDetails } from '../lsp-individual-details';

@Entity({ name: 'lsp_individual_certifications' })
export class LspIndividualCertification extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_individual_certification_id' })
  id: string;

  @ManyToOne(() => LspIndividualDetails, (lspIndividualDetails) => lspIndividualDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_individual_details_id_fk' })
  lspIndividualDetails: LspIndividualDetails;

  @Column({ name: 'name', length: 100 })
  name: string;
}
