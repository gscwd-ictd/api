import { MaterialCost } from '../api/cost-estimate/components/material-cost';
import { ItemCategory } from '../api/item/components/category';
import { ItemCharacteristic } from '../api/item/components/characteristic';
import { ItemClassification } from '../api/item/components/classification';
import { ItemSpecification } from '../api/item/components/specification';
import { MeasurementUnit } from '../api/item/components/unit';

export const DB_ENTITIES = [MaterialCost, ItemCharacteristic, ItemClassification, ItemCategory, ItemSpecification, MeasurementUnit];
