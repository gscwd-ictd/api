import { ItemCategory } from '../../category';

export class CreateItemSpecificationDto {
  category: ItemCategory;
  quantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  specs: string;
  description: string;
}

export class UpdateItemSpecificationDto {
  reorderPoint: number;
  reorderQuantity: number;
  specs: string;
  description: string;
}
