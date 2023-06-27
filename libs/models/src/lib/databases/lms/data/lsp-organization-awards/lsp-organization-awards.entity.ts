import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LspOrganizationDetails } from '../lsp-organization-details';

@Entity({ name: 'lsp_organization_awards' })
export class LspOrganizationAward extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_organization_award_id' })
  id: string;

  @ManyToOne(() => LspOrganizationDetails, (lspOrganizationDetails) => lspOrganizationDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_organization_details_id_fk' })
  lspOrganizationDetails: LspOrganizationDetails;

  @Column({ name: 'name', length: 100 })
  name: string;
}
