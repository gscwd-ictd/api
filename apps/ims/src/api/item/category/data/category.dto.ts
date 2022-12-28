export class CreateItemCategoryDto {
  classificationId: string;
  unitId: string;
  code: string;
  name: string;
  description: string;
}

export class UpdateItemCategoryDto {
  unitId: string;
  code: string;
  name: string;
  description: string;
}
