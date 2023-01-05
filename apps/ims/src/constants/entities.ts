import { ItemCategory } from '../api/item/components/category';
import { ItemCharacteristic } from '../api/item/components/characteristic';
import { ItemClassification } from '../api/item/components/classification';
import { ItemSpecification } from '../api/item/components/specification';
import { MeasurementUnit } from '../api/item/components/unit';
import { ProjectDetail } from '../api/cost-estimate/components/project-details';
import { EquipmentCost } from '../api/cost-estimate/components/equipment-cost';

export const DB_ENTITIES = [ItemCharacteristic, ItemClassification, ItemCategory, ItemSpecification, MeasurementUnit, ProjectDetail, EquipmentCost];
