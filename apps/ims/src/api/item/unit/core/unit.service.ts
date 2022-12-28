import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { MeasurementUnit } from '../data/unit.entity';

@Injectable()
export class UnitService extends CrudHelper<MeasurementUnit> {
  constructor(private readonly crudService: CrudService<MeasurementUnit>) {
    super(crudService);
  }
}
