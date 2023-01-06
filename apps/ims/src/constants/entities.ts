import { EquipmentCost } from '../api/cost-estimate/components/equipment-cost';
import { ProjectDetail } from '../api/cost-estimate/components/project-details';
import { ItemCategory } from '../api/item/components/category';
import { ItemCharacteristic } from '../api/item/components/characteristic';
import { ItemClassification } from '../api/item/components/classification';
import { ItemSpecification } from '../api/item/components/specification';
import { ItemCodeView } from '../api/item/data/item-code.view';
import { ItemDetailsView } from '../api/item/data/item-details.view';
import { UnitOfMeasure } from '../api/unit/components/unit-of-measure';
import { UnitType } from '../api/unit/components/unit-type';

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
  ItemCodeView,
  ItemDetailsView,
];
