import { ViewColumn, ViewEntity } from 'typeorm';
import { ITEM_CODE_VIEW_QUERY } from '../constants';

@ViewEntity({
  name: 'item_codes_view',
  expression: ITEM_CODE_VIEW_QUERY,
})
export class ItemCodeView {
  @ViewColumn()
  characteristic: string;

  @ViewColumn()
  classification: string;

  @ViewColumn()
  category: string;

  @ViewColumn()
  specification: string;
}
