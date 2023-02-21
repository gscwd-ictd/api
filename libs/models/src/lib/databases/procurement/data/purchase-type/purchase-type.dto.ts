import { PartialType } from '@nestjs/swagger';

// TODO add class validator
export class CreatePurchaseTypeDto {
  type: string;
}

export class UpdatePurchaseTypeDto extends PartialType(CreatePurchaseTypeDto) {}
