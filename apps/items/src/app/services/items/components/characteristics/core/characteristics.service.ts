import { ItemCharacteristic } from '@gscwd-api/models';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CharacteristicsService extends CrudHelper<ItemCharacteristic> {
  constructor(private readonly crudService: CrudService<ItemCharacteristic>) {
    super(crudService);
  }
}
