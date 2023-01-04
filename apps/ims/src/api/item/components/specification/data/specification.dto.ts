import { ItemCategory } from '../../category';

export class CreateItemSpecificationDto {
  category: ItemCategory;
  reorderPoint: number;
  code: string;
  specs: string;
  description: string;
}

export class UpdateItemSpecificationDto {
  reorderPoint: number;
  code: string;
  specs: string;
  description: string;
}
