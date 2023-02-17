import { PartialType } from '@nestjs/swagger';
import { PurchaseRequest } from '../purchase-request';

export class CreateRfqDto {
  purchaseRequest: PurchaseRequest;
  code?: string;
  submitWithin?: number;
  status?: string;
}

export class UpdateRfqDto extends PartialType(CreateRfqDto) {}
