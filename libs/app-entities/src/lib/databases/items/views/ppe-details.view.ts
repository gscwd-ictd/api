import { ViewColumn, ViewEntity } from 'typeorm';
import { ItemCharacteristic } from '../data/items';
import { PpeClassification, PpeCategory, PpeSpecification } from '../data/ppe';
import { UnitOfMeasure } from '../data/units';

@ViewEntity({
  name: 'ppe_details',
  expression: (datasource) =>
    datasource
      .createQueryBuilder()
      .select('ch.code', 'characteristic_code')
      .addSelect('ch.name', 'characteristic_name')
      .addSelect('cl.code', 'classification_code')
      .addSelect('cl.name', 'classification_name')
      .addSelect('ca.code', 'category_code')
      .addSelect('ca.name', 'category_name')
      .addSelect('sp.specification_id', 'specification_id')
      .addSelect('sp.code', 'specification_code')
      .addSelect('sp.details', 'details')
      .addSelect('sp.reorder_point', 'reorder_point')
      .addSelect('sp.reorder_quantity', 'reorder_quantity')
      .addSelect('sp.description', 'description')
      .addSelect('un.symbol', 'unit_symbol')
      .addSelect('un.name', 'unit_name')
      .addSelect('sp.created_at', 'created_at')
      .addSelect('sp.updated_at', 'updated_at')
      .from(PpeClassification, 'cl')
      .innerJoin(ItemCharacteristic, 'ch', 'ch.characteristic_id = cl.characteristic_id_fk')
      .innerJoin(PpeCategory, 'ca', 'ca.classification_id_fk = cl.classification_id')
      .innerJoin(PpeSpecification, 'sp', 'sp.category_id_fk = ca.category_id')
      .innerJoin(UnitOfMeasure, 'un', 'un.unit_of_measure_id = sp.unit_of_measure_id_fk'),
})
export class PpeDetailsView {
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
