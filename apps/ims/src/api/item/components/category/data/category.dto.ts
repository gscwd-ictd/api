import { ItemClassification } from '../../classification';
import { MeasurementUnit } from '../../unit';

export class CreateItemCategoryDto {
  classification: ItemClassification;
  unit: MeasurementUnit;
  name: string;
  description: string;
}

export class UpdateItemCategoryDto {
  name: string;
  description: string;
}

export class PatchItemCategoryDto {
  classification: ItemClassification;
  unit: MeasurementUnit;
}
