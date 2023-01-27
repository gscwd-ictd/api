import {
  ItemCategory,
  ItemCharacteristic,
  ItemClassification,
  ItemDetails,
  ItemSpecification,
  ItemsView,
  UnitOfMeasure,
} from '@gscwd-api/app-entities';

export const DB_ENTITIES = [
  // table entities
  UnitOfMeasure,
  ItemCharacteristic,
  ItemClassification,
  ItemCategory,
  ItemSpecification,
  ItemDetails,

  // table vews
  ItemsView,
];
