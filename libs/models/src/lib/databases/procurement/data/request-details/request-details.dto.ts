import { PartialType } from '@nestjs/swagger';
import { CreateRequestedItemDto } from '../requested-items';

export class CreatePurchaseRequestDetailsDto {
  code: string;
  requestingOffice: string;
  purpose: string;
  status: string;
  deliveryPlace: string;
}

export class UpdatePurchaseRequestDetailsDto extends PartialType(CreatePurchaseRequestDetailsDto) {}

export class CreatePurchaseRequestDto {
  details: CreatePurchaseRequestDetailsDto;
  items: CreateRequestedItemDto[];
}
