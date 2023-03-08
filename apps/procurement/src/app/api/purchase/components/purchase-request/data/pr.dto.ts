import { CreatePrDetailsDto, CreateRequestedItemDto } from '@gscwd-api/models';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsObject, ValidateNested } from 'class-validator';

export class CreatePrDto {
  @ValidateNested()
  @IsObject()
  @Type(() => CreatePrDetailsDto)
  details: CreatePrDetailsDto;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => CreateRequestedItemDto)
  items: CreateRequestedItemDto[];
}
