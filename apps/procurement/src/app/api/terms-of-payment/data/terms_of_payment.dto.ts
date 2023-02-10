import { PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ModeofPayment } from '../../mode-of-payment';

export class CreateTermsofPaymentDto {
  @IsNumber()
  noOfDays: number;

  modeOfPayment: ModeofPayment;
}
export class UpdateTermsofPaymentDto extends PartialType(CreateTermsofPaymentDto) {}
