import {
  ItemCategory,
  ItemCharacteristic,
  ItemClassification,
  ItemDetailsView,
  ItemPpeDetailsView,
  ItemSpecification,
  PpeCategory,
  PpeClassification,
  PpeDetailsView,
  PpeSpecification,
  UnitOfMeasure,
  UnitType,
} from '@gscwd-api/app-entities';

export const DB_ENTITIES = [
  // items
  ItemCharacteristic,
  ItemClassification,
  ItemCategory,
  ItemSpecification,

  // ppe
  PpeClassification,
  PpeCategory,
  PpeSpecification,

  // units
  UnitType,
  UnitOfMeasure,

  // vews
  ItemDetailsView,
  PpeDetailsView,
  ItemPpeDetailsView,
];
