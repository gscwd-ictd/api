import { MaterialCost } from '../api/cost-estimate/components/material-cost';
import { ItemCategory } from '../api/item/components/category';
import { ItemCharacteristic } from '../api/item/components/characteristic';
import { ItemClassification } from '../api/item/components/classification';
import { ItemSpecification } from '../api/item/components/specification';
import { MeasurementUnit } from '../api/item/components/unit';
import { ItemCodeView } from '../api/item/data/item-code.view';
import { ItemDetailsView } from '../api/item/data/item-details.view';

export const DB_ENTITIES = [
  // table entities
  MaterialCost,
  ItemCharacteristic,
  ItemClassification,
  ItemCategory,
  ItemSpecification,
  MeasurementUnit,

  // entity views
  ItemCodeView,
  ItemDetailsView,
];
