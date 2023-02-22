import { PartialType } from '@nestjs/swagger';
import { PurchaseType } from '../purchase-type';

// TODO add class validator
export class CreatePrDto {
  type: PurchaseType;
  code: string;
  accountId: string;
  projectId: string;
  requestingOffice: string;
  purpose: string;
  deliveryPlace: string;
}

export class UpdatePrDto extends PartialType(CreatePrDto) {}
