import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'item_union_ppe',
  expression: 'SELECT * FROM item_details UNION SELECT * FROM ppe_details',
})
export class ItemPpeDetailsView {
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
  specification_id: string;

  @ViewColumn()
  specification_code: string;

  @ViewColumn()
  details: string;

  @ViewColumn()
  reorder_point: number;

  @ViewColumn()
  reorder_quantity: number;

  @ViewColumn()
  description: string;

  @ViewColumn()
  unit_symbol: string;

  @ViewColumn()
  unit_name: string;

  @ViewColumn()
  created_at: Date;

  @ViewColumn()
  updated_at: Date;
}
