import { ViewColumn, ViewEntity } from 'typeorm';
import { AccountGroup, ContraAccount, GeneralLedgerAccount, MajorAccountGroup, SubMajorAccountGroup } from '../data';

@ViewEntity({
  name: 'chart_of_accounts_view',
  expression: (datasource) =>
    datasource
      .createQueryBuilder()
      .select('ag.code', 'account_group_code')
      .addSelect('ag.name', 'account_group_name')
      .addSelect('ma.code', 'major_account_group_code')
      .addSelect('ma.name', 'major_account_group_name')
      .from(AccountGroup, 'ag')
      .leftJoin(MajorAccountGroup, 'ma', 'cl.characteristic_id_fk = ch.characteristic_id')
      .innerJoin(SubMajorAccountGroup, 'sm', 'ca.classification_id_fk = cl.classification_id')
      .innerJoin(GeneralLedgerAccount, 'gl', 'sp.category_id_fk = ca.category_id')
      .innerJoin(ContraAccount, 'ca', 'sp.category_id_fk = ca.category_id'),
})
export class ChartOfAccountsView {
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
