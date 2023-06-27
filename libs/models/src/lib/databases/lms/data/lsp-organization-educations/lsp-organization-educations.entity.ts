import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LspOrganizationDetails } from '../lsp-organization-details';
import { DatabaseEntity, IEntity } from '@gscwd-api/crud';

@Entity({ name: 'lsp_organization_educations' })
export class LspOrganizationEducation extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_organization_education_id' })
  id: string;

  @ManyToOne(() => LspOrganizationDetails, (lspOrganizationDetails) => lspOrganizationDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_organization_details_id_fk' })
  lspOrganizationDetails: LspOrganizationDetails;

  @Column({ name: 'degree', length: 100 })
  degree: string;

  @Column({ name: 'institution', length: 100 })
  institution: string;
}
