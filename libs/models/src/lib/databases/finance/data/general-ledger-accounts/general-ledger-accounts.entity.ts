import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { GeneralLedgerContraAccountType } from '../general-ledger-contra-account-types';
import { SubMajorAccountGroup } from '../sub-major-account-groups';

@Entity({ name: 'general_ledger_accounts' })
@Unique(['subMajorAccountGroup', 'code', 'generalLedgerContraAccountType'])
export class GeneralLedgerAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'general_ledger_account_id' })
  id: string;

  @ManyToOne(() => SubMajorAccountGroup, (subMajorAccountGroup) => subMajorAccountGroup.id, { nullable: false })
  @JoinColumn({ name: 'sub_major_account_group_id_fk' })
  subMajorAccountGroup: SubMajorAccountGroup;

  @ManyToOne(() => GeneralLedgerContraAccountType, (generalLedgerContraAccountType) => generalLedgerContraAccountType.id, { nullable: false })
  @JoinColumn({ name: 'general_ledger_contra_account_group_id_fk' })
  generalLedgerContraAccountType: GeneralLedgerContraAccountType;

  @Column({ length: 2 })
  code: string;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
