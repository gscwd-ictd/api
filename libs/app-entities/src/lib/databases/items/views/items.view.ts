import { ViewColumn, ViewEntity } from 'typeorm';
import { ItemClassification, ItemCharacteristic, ItemCategory, ItemSpecification, UnitOfMeasure, ItemDetails } from '../data';

@ViewEntity({
  name: 'items_view',
  expression: (datasource) =>
    datasource
      .createQueryBuilder()
      .select('ch.code', 'characteristic_code')
      .addSelect('ch.name', 'characteristic_name')
      .addSelect('cl.code', 'classification_code')
      .addSelect('cl.name', 'classification_name')
      .addSelect('ca.code', 'category_code')
      .addSelect('ca.name', 'category_name')
      .addSelect('sp.code', 'specification_code')
      .addSelect('sp.name', 'specification_name')
      .addSelect('sp.description', 'description')
      .addSelect('de.details_id', 'details_id')
      .addSelect('de.balance', 'balance')
      .addSelect('de.reorder_point', 'reorder_point')
      .addSelect('de.reorder_quantity', 'reorder_quantity')
      .addSelect('de.created_at', 'created_at')
      .addSelect('de.updated_at', 'updated_at')
      .addSelect('un.name', 'unit_name')
      .addSelect('un.symbol', 'unit_symbol')
      .from(ItemCharacteristic, 'ch')
      .innerJoin(ItemClassification, 'cl', 'cl.characteristic_id_fk = ch.characteristic_id')
      .innerJoin(ItemCategory, 'ca', 'ca.classification_id_fk = cl.classification_id')
      .innerJoin(ItemSpecification, 'sp', 'sp.category_id_fk = ca.category_id')
      .innerJoin(ItemDetails, 'de', 'de.specification_id_fk = sp.specification_id')
      .innerJoin(UnitOfMeasure, 'un', 'un.unit_id = sp.unit_id_fk'),
})
export class ItemsView {
  @ViewColumn()
  details_id: string;

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
  specification_name: string;

  @ViewColumn()
  description: string;

  @ViewColumn()
  balance: number;

  @ViewColumn()
  reorder_point: Date;

  @ViewColumn()
  reorder_quantity: Date;

  @ViewColumn()
  unit_name: string;

  @ViewColumn()
  unit_symbol: string;

  @ViewColumn()
  created_at: Date;

  @ViewColumn()
  updated_at: Date;
}
