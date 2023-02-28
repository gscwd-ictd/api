import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';
import { ModeofPayment } from '../mode-of-payment';

export class CreateTermsofPaymentDto {
  @IsUUID()
  modeofPaymentID: ModeofPayment;

  @IsNumber()
  noOfDays: number;
}
export class UpdateTermsofPaymentDto extends PartialType(CreateTermsofPaymentDto) {}
