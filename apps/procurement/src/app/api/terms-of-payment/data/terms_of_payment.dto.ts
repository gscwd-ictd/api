import { PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTermsofPaymentDto {
  @IsNumber()
  noOfDays: number;
}
export class UpdateTermsofPaymentDto extends PartialType(CreateTermsofPaymentDto) {}
