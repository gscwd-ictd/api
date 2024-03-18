import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { LspSource, LspType } from '@gscwd-api/utils';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'lsp_details' })
@Unique(['firstName', 'middleName', 'lastName'])
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

  @Column({ name: 'organization_name', unique: true, type: 'varchar', length: '100', nullable: true })
  organizationName: string;

  @Column({ name: 'sex', type: 'varchar', length: '10', nullable: true })
  sex: string;

  @Column({ name: 'contact_number', type: 'varchar', nullable: true })
  contactNumber: string;

  @Column({ name: 'email', type: 'varchar', length: '50', nullable: true })
  email: string;

  @Column({ name: 'tax_identification_number', nullable: true })
  tin: string;

  @Column({ name: 'postal_address', type: 'varchar', length: 100, nullable: true })
  postalAddress: string;

  @Column({ name: 'subject_matter_expertise', type: 'jsonb', nullable: true })
  expertise: string;

  @Column({ name: 'photo_id', type: 'varchar', nullable: true })
  photoId: string;

  @Column({ name: 'experience_number_of_years', nullable: true })
  experience: number;

  @Column({ name: 'introduction', length: 250, nullable: true })
  introduction: string;

  @Column({ name: 'lsp_type', type: 'enum', enum: LspType, nullable: false })
  type: LspType;

  @Column({ name: 'lsp_source', type: 'enum', enum: LspSource, nullable: false })
  source: LspSource;

  get fullName(): string {
    const fullName: string[] = [];

    if (this.prefixName) {
      fullName.push(this.prefixName);
    }

    if (this.firstName) {
      fullName.push(this.firstName);
    }

    if (this.middleName) {
      fullName.push(this.middleName.substring(0, 1) + '.');
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
