import { UnitType } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnitTypesService extends CrudHelper<UnitType> {
  constructor(private readonly crudService: CrudService<UnitType>) {
    super(crudService);
  }
}
