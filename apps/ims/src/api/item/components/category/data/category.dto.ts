import { UnitOfMeasure } from '../../../../unit/components/unit-of-measure';
import { ItemClassification } from '../../classification';

export class CreateItemCategoryDto {
  classification: ItemClassification;
  unit: UnitOfMeasure;
  name: string;
  description: string;
}

export class UpdateItemCategoryDto {
  name: string;
  description: string;
}

export class PatchItemCategoryDto {
  classification: ItemClassification;
  unit: UnitOfMeasure;
}
