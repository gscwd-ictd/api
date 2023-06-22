import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LspDetails } from '../lsp-details';

@Entity({ name: 'lsp_individual_affiliations' })
export class LspIndividualAffiliation extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_individual_affiliation_id' })
  id: string;

  @ManyToOne(() => LspDetails, (lspDetails) => lspDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_details_id_fk' })
  lspDetails: LspDetails;

  @Column({ name: 'position', length: 100 })
  position: string;

  @Column({ name: 'institution', length: 100 })
  institution: string;
}
