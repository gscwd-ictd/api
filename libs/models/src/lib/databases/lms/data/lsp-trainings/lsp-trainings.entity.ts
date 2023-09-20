import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LspDetails } from '../lsp-details';

@Entity({ name: 'lsp_trainings' })
export class LspTraining extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_training_id' })
  id: string;

  @ManyToOne(() => LspDetails, (lspDetails) => lspDetails.id, { nullable: false })
  @JoinColumn({ name: 'lsp_details_id_fk' })
  lspDetails: LspDetails;

  @Column({ name: 'name', length: 100 })
  name: string;
}
