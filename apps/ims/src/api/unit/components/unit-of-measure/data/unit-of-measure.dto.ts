import { UnitType } from '../../unit-type';

export class CreateUnitOfMeasureDto {
  unitType: UnitType;
  name: string;
  symbol: string;
}

export class UpdateUnitOfMeasureDto {
  name: string;
  symbol: string;
}
