import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LspSource } from '../lsp-sources';

@Entity('lsp_details')
export class LspDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_id' })
  id: string;

  @Column({ name: 'employee_id_fk', nullable: true })
  employeeId: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'middle_name', length: 100 })
  middleName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

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
