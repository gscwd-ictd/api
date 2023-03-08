import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRequestedItemDto {
  @IsUUID(4, { message: 'purchase type is not valid' })
  itemId: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 }, { message: 'quantity must be a valid number' })
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsString({ message: 'remarks must be a valid string' })
  remarks: string;
}

export class UpdateRequestedItemForRfqDto {
  @IsUUID()
  itemId: string;
}
