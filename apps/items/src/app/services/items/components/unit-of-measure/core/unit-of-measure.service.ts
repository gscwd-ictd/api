import { UnitOfMeasure } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnitOfMeasureService extends CrudHelper<UnitOfMeasure> {
  constructor(private readonly crudService: CrudService<UnitOfMeasure>) {
    super(crudService);
  }
}
