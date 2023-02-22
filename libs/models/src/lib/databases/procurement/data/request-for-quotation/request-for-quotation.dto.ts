import { PartialType } from '@nestjs/swagger';
import { PurchaseRequest } from '../purchase-request';

// TODO add class validator
export class CreateRfqDto {
  purchaseRequest: PurchaseRequest;

  // TODO remove this once format is finalized
  code?: string;

  submitWithin?: number;
}

export class UpdateRfqDto extends PartialType(CreateRfqDto) {}
