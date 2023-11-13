import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { LspSource, LspType } from '@gscwd-api/utils';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lsp_details' })
export class LspDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_details_id' })
  id: string;

  @Column({ name: 'employee_id_fk', unique: true, nullable: true })
  employeeId: string;

  @Column({ name: 'first_name', type: 'varchar', length: '50', nullable: true })
  firstName: string;

  @Column({ name: 'middle_name', type: 'varchar', length: '50', nullable: true })
  middleName: string;

  @Column({ name: 'last_name', type: 'varchar', length: '50', nullable: true })
  lastName: string;

  @Column({ name: 'prefix_name', type: 'varchar', length: '20', nullable: true })
  prefixName: string;

  @Column({ name: 'suffix_name', type: 'varchar', length: '20', nullable: true })
  suffixName: string;

  @Column({ name: 'extension_name', type: 'varchar', length: '10', nullable: true })
  extensionName: string;

  @Column({ name: 'organization_name', type: 'varchar', length: '100', nullable: true })
  organizationName: string;

  @Column({ name: 'sex', type: 'varchar', length: '10', nullable: true })
  sex: string;

  @Column({ name: 'contact_number', type: 'varchar', nullable: true })
  contactNumber: string;

  @Column({ name: 'email', type: 'varchar', length: '50', nullable: true })
  email: string;

  @Column({ name: 'postal_address', type: 'varchar', length: 100, nullable: true })
  postalAddress: string;

  @Column({ name: 'subject_matter_expertise', type: 'jsonb', nullable: true })
  expertise: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;

  @Column({ name: 'experience_number_of_years', nullable: true })
  experience: number;

  @Column({ name: 'tax_identification_number', nullable: true })
  tin: string;

  @Column({ name: 'introduction', length: 250, nullable: true })
  introduction: string;

  @Column({ name: 'lsp_type', type: 'enum', enum: LspType, nullable: false })
  lspType: LspType;

  @Column({ name: 'lsp_source', type: 'enum', enum: LspSource, nullable: false })
  lspSource: LspSource;

  get fullName(): string {
    const fullName: string[] = [];

    if (this.prefixName) {
      fullName.push(this.prefixName);
    }

    if (this.firstName) {
      fullName.push(this.firstName);
    }

    if (this.middleName) {
      fullName.push(this.middleName);
    }

    if (this.lastName) {
      fullName.push(this.lastName);
    }

    if (this.suffixName) {
      fullName.push(this.suffixName);
    }

    if (this.extensionName) {
      fullName.push(this.extensionName);
    }

    return fullName.join(' ').trim();
  }
}
