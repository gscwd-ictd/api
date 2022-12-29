import { ItemCharacteristic } from '../../characteristic';

export class CreateItemClassificationDto {
  characteristic: ItemCharacteristic;
  code: string;
  name: string;
  description: string;
}

export class UpdateItemClassificationDto {
  code: string;
  name: string;
  description: string;
}
