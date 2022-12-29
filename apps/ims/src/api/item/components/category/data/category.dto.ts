import { ItemClassification } from '../../classification';
import { MeasurementUnit } from '../../unit';

export class CreateItemCategoryDto {
  classification: ItemClassification;
  unit: MeasurementUnit;
  code: string;
  name: string;
  description: string;
}

export class UpdateItemCategoryDto extends CreateItemCategoryDto {}
