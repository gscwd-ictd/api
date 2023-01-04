export class CreateMaterialCostDto {
  project_name: string;
  location: string;
  itemNumber: string;
  workDescription: string;
  quantity: number;
  outputPerDay: number;
}

export class UpdateMaterialCostDto extends CreateMaterialCostDto {}
