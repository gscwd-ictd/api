import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { UnitOfMeasure } from '../data/unit-of-measure.entity';

@Injectable()
export class UnitOfMeasureService extends CrudHelper<UnitOfMeasure> {
  constructor(private readonly crudService: CrudService<UnitOfMeasure>) {
    super(crudService);
  }
}
