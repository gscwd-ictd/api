import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ItemCharacteristic } from '../data/characteristic.entity';

@Injectable()
export class CharacteristicService extends CrudHelper<ItemCharacteristic> {
  constructor(private readonly crudService: CrudService<ItemCharacteristic>) {
    super(crudService);
  }
}
