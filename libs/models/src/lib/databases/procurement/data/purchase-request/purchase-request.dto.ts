import { PartialType } from '@nestjs/swagger';

export class CreatePrDto {
  code: string;
  accountId: string;
  projectId: string;
  requestingOffice: string;
  purpose: string;
  deliveryPlace: string;
  type: string;
  status?: string;
}

export class UpdatePrDto extends PartialType(CreatePrDto) {}
