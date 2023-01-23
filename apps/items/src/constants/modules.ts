import { ItemsPpeModule } from '../app/services/items-ppe/';
import { ItemsModule } from '../app/services/items/core/items.module';
import { PpeModule } from '../app/services/ppe/core/ppe.module';
import { UnitModule } from '../app/services/units/core/unit.module';

export const APP_MODULES = [
  //
  ItemsModule,
  ItemsPpeModule,
  PpeModule,
  UnitModule,
  ItemsPpeModule,
];
