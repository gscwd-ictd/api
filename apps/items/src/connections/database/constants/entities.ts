import { ItemCategory, ItemCharacteristic, ItemClassification, ItemDetails, ItemSpecification, ItemsView, UnitOfMeasure } from '@gscwd-api/models';

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
