import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LspDetails } from '../lsp-details';

@Entity({ name: 'lsp_certifications' })
export class LspCertification extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_certification_id' })
  id: string;

  @ManyToOne(() => LspDetails, (lspDetails) => lspDetails.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lsp_details_id_fk' })
  lspDetails: LspDetails;

  @Column({ name: 'name', length: 100 })
  name: string;
}
