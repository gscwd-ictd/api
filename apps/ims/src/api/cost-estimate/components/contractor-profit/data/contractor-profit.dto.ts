import { ItemClassification } from 'apps/ims/src/api/item/components/classification';

export class CreateContractorProfitDto {
  classification: ItemClassification;
  percentage: number;
}

export class UpdateContractorProfitDto extends CreateContractorProfitDto {}
