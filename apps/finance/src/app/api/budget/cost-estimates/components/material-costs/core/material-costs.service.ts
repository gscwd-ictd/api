import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MaterialCost } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MaterialCostService extends CrudHelper<MaterialCost> {
  constructor(private readonly crudService: CrudService<MaterialCost>) {
    super(crudService);
  }
}
