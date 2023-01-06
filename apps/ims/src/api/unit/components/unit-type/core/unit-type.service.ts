import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { UnitType } from '../data/unit-type.entity';

@Injectable()
export class UnitTypeService extends CrudHelper<UnitType> {
  constructor(private readonly crudService: CrudService<UnitType>) {
    super(crudService);
  }
}
