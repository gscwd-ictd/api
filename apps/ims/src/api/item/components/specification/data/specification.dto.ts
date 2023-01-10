import { UnitOfMeasure } from '../../../../unit/components/unit-of-measure';
import { ItemCategory } from '../../category';

export class CreateItemSpecificationDto {
  category: ItemCategory;
  unit: UnitOfMeasure;
  quantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  details: string;
  description: string;
}

export class UpdateItemSpecificationDto {
  quantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  details: string;
  description: string;
}
