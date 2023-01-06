import { ViewColumn, ViewEntity } from 'typeorm';
import { UNITS_VIEW_QUERY } from '../constants';

@ViewEntity({ name: 'units_view', expression: UNITS_VIEW_QUERY })
export class UnitsView {
  @ViewColumn()
  type: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  symbol: string;
}
