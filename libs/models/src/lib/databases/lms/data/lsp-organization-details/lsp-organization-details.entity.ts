import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LspSource } from '../lsp-sources';

@Entity('lsp_organization_details')
export class LspOrganizationDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_organization_details_id' })
  id: string;

  @Column({ name: 'full_name', length: 200 })
  fullName: string;

  @Column({ name: 'contact_number', type: 'varchar', nullable: true })
  contactNumber: string;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email: string;

  @Column({ name: 'postal_address', length: 100 })
  postalAddress: string;

  @Column({ name: 'subject_matter_expertise', type: 'jsonb', nullable: true })
  expertise: string;

  @Column({ name: 'photo_url' })
  photoUrl: string;

  @Column({ name: 'experience_number_of_years' })
  experience: number;

  @Column({ name: 'tax_identification_number', nullable: true })
  tin: string;

  @Column({ name: 'introduction', length: 150, nullable: true })
  introduction: string;

  @ManyToOne(() => LspSource, (lspSource) => lspSource.id, { nullable: false })
  @JoinColumn({ name: 'lsp_source_id_fk' })
  lspSource: LspSource;
}
