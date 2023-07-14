import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LspOrganizationDetails } from '../lsp-organization-details';

@Entity({ name: 'lsp_organization_affiliations' })
export class LspOrganizationAffiliation extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_organization_affiliation_id' })
  id: string;

  @ManyToOne(() => LspOrganizationDetails, (lspOrganizationDetails) => lspOrganizationDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_organization_details_id_fk' })
  lspOrganizationDetails: LspOrganizationDetails;

  @Column({ name: 'position', length: 100 })
  position: string;

  @Column({ name: 'institution', length: 100 })
  institution: string;
}
