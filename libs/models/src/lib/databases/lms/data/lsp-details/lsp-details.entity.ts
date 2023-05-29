import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainingSource } from '../training-sources';

@Entity('lsp_details')
export class LspDetails extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_id' })
  id: string;

  @Column({ name: 'employee_id_fk' })
  employeeId: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'middle_name', length: 100 })
  middleName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'contact_number', length: 11 })
  contactNumber: string;

  @Column({ name: 'email', length: 100 })
  email: string;

  @Column({ name: 'postal_address', length: 100 })
  postalAddress: string;

  @Column({ name: 'subject_matter_expertise', type: 'jsonb', nullable: true })
  subjectMatterExpertise: string;

  @Column({ name: 'educational_attainment', length: 100 })
  educationalAttainment: string;

  @Column({ name: 'photo_url' })
  photoUrl: string;

  @ManyToOne(() => TrainingSource, (trainingSource) => trainingSource.id, { nullable: false })
  @JoinColumn({ name: 'training_type_id_fk' })
  trainingSource: TrainingSource;
}
