import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'general_ledger_contra_account_types' })
export class GeneralLedgerContraAccountType extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'general_ledger_contra_account_type_id' })
  id: string;

  @Column({ unique: true, length: 1 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
