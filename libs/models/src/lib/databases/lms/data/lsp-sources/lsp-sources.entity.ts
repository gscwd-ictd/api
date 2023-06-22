import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lsp_sources' })
export class LspSource extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'lsp_source_id' })
  id: string;

  @Column({ name: 'name', unique: true, length: 50, nullable: false })
  name: string;
}
