import { CreateRfqDto, RequestedItem } from '@gscwd-api/models';

export class CreateQuotationRequestDto {
  details: CreateRfqDto;
  items: RequestedItem[];
}
