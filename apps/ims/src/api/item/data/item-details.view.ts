import { ViewColumn, ViewEntity } from 'typeorm';
import { ITEM_DETAILS_QUERY } from '../constants';

@ViewEntity({
  expression: ITEM_DETAILS_QUERY,
})
export class ItemDetailsView {
  @ViewColumn()
  characteristic_code: string;

  @ViewColumn()
  characteristic_name: string;

  @ViewColumn()
  classification_code: string;

  @ViewColumn()
  classification_name: string;

  @ViewColumn()
  category_code: string;

  @ViewColumn()
  category_name: string;

  @ViewColumn()
  specification_code: string;

  @ViewColumn()
  details: string;

  @ViewColumn()
  quantity: number;

  @ViewColumn()
  unit_symbol: string;

  @ViewColumn()
  unit_name: string;
}
