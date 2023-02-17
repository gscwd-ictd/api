import { CreatePrDto, CreateRequestedItemDto } from '@gscwd-api/models';

export class CreatePurchaseRequestDto {
  details: CreatePrDto;
  items: CreateRequestedItemDto[];
}
