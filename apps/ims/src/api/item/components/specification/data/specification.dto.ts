export class CreateItemSpecificationDto {
  categoryId: string;
  reorderPoint: number;
  code: string;
  specification: string;
  description: string;
}

export class UpdateItemSpecificationDto {
  reorderPoint: number;
  code: string;
  specification: string;
  description: string;
}
