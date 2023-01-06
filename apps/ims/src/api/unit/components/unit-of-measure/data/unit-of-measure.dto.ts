import { UnitType } from '../../unit-type';

export class CreateUnitOfMeasureDto {
  type: UnitType;
  name: string;
  symbol: string;
  description: string;
}

export class UpdateUnitOfMeasureDto {
  name: string;
  symbol: string;
  description: string;
}
