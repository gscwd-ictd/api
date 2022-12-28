export class CreateItemCharacteristicsDto {
  code: string;
  name: string;
  description: string;
}

export class UpdateItemCharacteristicsDto extends CreateItemCharacteristicsDto {}
