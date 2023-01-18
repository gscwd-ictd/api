import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { MaterialCost } from '../data/material-cost.entity';

@Injectable()
export class MaterialCostService extends CrudHelper<MaterialCost> {
  constructor(private readonly crudService: CrudService<MaterialCost>) {
    super(crudService);
  }
}
