import { ItemClassification } from 'apps/ims/src/api/item/components/classification';

export class CreateMaterialCostDto {
  classification: ItemClassification;
  quantity: number;
  unitCost: number;
  amount: number;
}

export class UpdateMaterialCostDto extends CreateMaterialCostDto {}
