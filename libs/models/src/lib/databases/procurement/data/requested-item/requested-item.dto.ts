import { PartialType } from '@nestjs/swagger';

export class CreateRequestedItemDto {
  itemId: string;
  quantity: number;
  remarks: string;
}

export class UpdateRequestedItemDto extends PartialType(CreateRequestedItemDto) {}
