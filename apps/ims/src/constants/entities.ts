import { EquipmentCost } from '../api/cost-estimate/components/equipment-cost';
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
