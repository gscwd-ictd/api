import { EquipmentCost } from '../api/cost-estimate/components/equipment-cost';
import { LaborCost } from '../api/cost-estimate/components/labor-cost';
import { LaborType } from '../api/cost-estimate/components/labor-type';
import { MaterialCost } from '../api/cost-estimate/components/material-cost';
import { ProjectDetail } from '../api/cost-estimate/components/project-details';
import { ItemCategory } from '../api/item/components/category';
import { ItemCharacteristic } from '../api/item/components/characteristic';
import { ItemClassification } from '../api/item/components/classification';
import { ItemSpecification } from '../api/item/components/specification';
import { ItemCodesView } from '../api/item/data/item-codes.view';
import { ItemDetailsView } from '../api/item/data/item-details.view';
import { UnitOfMeasure } from '../api/unit/components/unit-of-measure';
import { UnitType } from '../api/unit/components/unit-type';
import { UnitsView } from '../api/unit/data/units-view';

export const DB_ENTITIES = [
  // table entities
  ProjectDetail,
  EquipmentCost,
  LaborType,
  LaborCost,
  MaterialCost,

  ItemCharacteristic,
  ItemClassification,
  ItemCategory,
  ItemSpecification,

  UnitType,
  UnitOfMeasure,

  // entity views
  ItemCodesView,
  ItemDetailsView,
  UnitsView,
];
