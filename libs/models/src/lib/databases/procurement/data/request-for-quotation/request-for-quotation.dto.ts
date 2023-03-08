import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsUUID, ValidateNested } from 'class-validator';
import { UpdateRequestedItemForRfqDto } from '../requested-item';

export class CreateRfqDto {
  @IsUUID(4, { message: 'purchase request id is not valid' })
  prId: string;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => UpdateRequestedItemForRfqDto)
  items: UpdateRequestedItemForRfqDto[];
}
