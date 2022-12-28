export class CreateItemClassificationDto {
  characteristicId: string;
  code: string;
  name: string;
  description: string;
}

export class UpdateItemClassificationDto {
  code: string;
  name: string;
  description: string;
}
