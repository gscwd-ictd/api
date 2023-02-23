import { PartialType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateModeOfPaymentDto {
  @IsString()
  @MaxLength(50, { message: 'Description name exceed 50 character.' })
  description: string;
}
export class UpdateModeOfPaymentDto extends PartialType(CreateModeOfPaymentDto) {}
