import { CostEstimateModule } from '../api/cost-estimate';
import { ItemModule } from '../api/item';
import { UnitModule } from '../api/unit/core/unit.module';

export const API_MODULES = [ItemModule, UnitModule, CostEstimateModule];
