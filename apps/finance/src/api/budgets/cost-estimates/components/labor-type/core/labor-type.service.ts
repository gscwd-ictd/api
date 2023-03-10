import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { LaborType } from '../data/labor-type.entity';

@Injectable()
export class LaborTypeService extends CrudHelper<LaborType> {
  constructor(private readonly crudService: CrudService<LaborType>) {
    super(crudService);
  }
}
