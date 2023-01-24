import { ItemsModue } from '../app/services/items';
import { ItemsPpeModule } from '../app/services/items-ppe';
import { PpeModule } from '../app/services/ppe/core/ppe.module';
import { UnitsModule } from '../app/services/units';

export const SERVICES_MODULES = [UnitsModule, ItemsModue, PpeModule, ItemsPpeModule];
