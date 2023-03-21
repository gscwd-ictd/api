import { ViewColumn, ViewEntity } from 'typeorm';
import { AccountGroup, ContraAccount, GeneralLedgerAccount, MajorAccountGroup, SubMajorAccountGroup } from '../data';

@ViewEntity({
  name: 'chart_of_accounts_view',
  expression: (datasource) =>
    datasource
      .createQueryBuilder()
      .select('gl.general_ledger_account_id', 'general_ledger_account_id')
      .addSelect('ag.code', 'account_group_code')
      .addSelect('ag.name', 'account_group_name')
      .addSelect('ma.code', 'major_account_group_code')
      .addSelect('ma.name', 'major_account_group_name')
      .addSelect('sm.name', 'sub_major_account_group_name')
      .addSelect('sm.code', 'sub_major_account_group_code')
      .addSelect('gl.code', 'general_ledger_account_code')
      .addSelect('gl.name', 'general_ledger_account_name')
      .addSelect('ca.code', 'contra_account_code')
      .addSelect('ca.name', 'contra_account_name')
      .from(AccountGroup, 'ag')
      .innerJoin(MajorAccountGroup, 'ma', 'ma.account_group_id_fk = ag.account_group_id')
      .innerJoin(SubMajorAccountGroup, 'sm', 'sm.major_account_group_id_fk = ma.major_account_group_id')
      .innerJoin(GeneralLedgerAccount, 'gl', 'gl.sub_major_account_group_id_fk = sm.sub_major_account_group_id')
      .innerJoin(ContraAccount, 'ca', 'ca.contra_account_id = gl.contra_account_id_fk'),
})
export class ChartOfAccountsView {
  @ViewColumn()
  general_ledger_account_id: string;

  @ViewColumn()
  account_group_code: string;

  @ViewColumn()
  account_group_name: string;

  @ViewColumn()
  major_account_group_code: string;

  @ViewColumn()
  major_account_group_name: string;

  @ViewColumn()
  sub_major_account_group_code: string;

  @ViewColumn()
  sub_major_account_group_name: string;

  @ViewColumn()
  general_ledger_account_code: string;

  @ViewColumn()
  general_ledger_account_name: string;

  @ViewColumn()
  contra_account_code: string;

  @ViewColumn()
  contra_account_name: string;
}
