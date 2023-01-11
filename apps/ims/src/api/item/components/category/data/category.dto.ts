import { ItemClassification } from '../../classification';

export class CreateItemCategoryDto {
  classification: ItemClassification;
  name: string;
  description: string;
}

export class UpdateItemCategoryDto {
  name: string;
  description: string;
}

export class PatchItemCategoryDto {
  classification: ItemClassification;
}
