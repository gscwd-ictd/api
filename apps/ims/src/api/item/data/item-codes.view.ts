import { ViewColumn, ViewEntity } from 'typeorm';
import { ITEM_CODES_VIEW_QUERY } from '../constants';

@ViewEntity({
  name: 'item_codes_view',
  expression: ITEM_CODES_VIEW_QUERY,
})
export class ItemCodesView {
  @ViewColumn()
  characteristic: string;

  @ViewColumn()
  classification: string;

  @ViewColumn()
  category: string;

  @ViewColumn()
  specification: string;
}
