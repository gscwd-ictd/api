import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePurchaseTypeDto {
  @IsString({ message: 'purchase type must be a string' })
  type: string;
}

export class UpdatePurchaseTypeDto extends PartialType(CreatePurchaseTypeDto) {}
