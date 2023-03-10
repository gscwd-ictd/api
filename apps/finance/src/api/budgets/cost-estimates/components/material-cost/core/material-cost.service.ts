import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MaterialCostService extends CrudHelper<MaterialCostService> {
  constructor(private readonly crudService: CrudService<MaterialCostService>) {
    super(crudService);
  }
}
