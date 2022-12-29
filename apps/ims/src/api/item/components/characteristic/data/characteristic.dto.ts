//! perhaps just one dto? i.e. ItemCharacteristicDto

export class CreateItemCharacteristicsDto {
  code: string;
  name: string;
  description: string;
}

export class UpdateItemCharacteristicsDto extends CreateItemCharacteristicsDto {}
