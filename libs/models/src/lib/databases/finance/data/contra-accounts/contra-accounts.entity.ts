import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'contra_accounts' })
export class ContraAccount extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'contra_account_id' })
  id: string;

  @Column({ unique: true, length: 1 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
