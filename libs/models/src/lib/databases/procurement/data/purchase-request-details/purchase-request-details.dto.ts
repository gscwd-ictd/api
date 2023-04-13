import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreatePrDetailsDto {
  @IsUUID(4, { message: 'purchase type is not valid' })
  purchaseType: string;

  @IsUUID(4, { message: 'project details id is not valid' })
  projectDetailsId: string;

  @IsUUID('all', { message: 'requesting office id is not valid' })
  requestingOffice: string;

  @IsString({ message: 'purpose must be a string' })
  purpose: string;

  @IsString({ message: 'delivery place must be a string' })
  deliveryPlace: string;
}

export class UpdatePrDto extends PartialType(CreatePrDetailsDto) {}
