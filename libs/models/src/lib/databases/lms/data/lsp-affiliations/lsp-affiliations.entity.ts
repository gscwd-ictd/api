import { DatabaseEntityWithTimezone, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LspDetails } from '../lsp-details';

@Entity({ name: 'lsp_affiliations' })
export class LspAffiliation extends DatabaseEntityWithTimezone implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_affiliation_id' })
  id: string;

  @ManyToOne(() => LspDetails, (lspDetails) => lspDetails.id, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lsp_details_id_fk' })
  lspDetails: LspDetails;

  @Column({ name: 'position', length: 100 })
  position: string;

  @Column({ name: 'institution', length: 100 })
  institution: string;
}
