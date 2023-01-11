import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { LaborCost } from '../data/labor-cost.entity';

@Injectable()
export class LaborCostService extends CrudHelper<LaborCost> {
  constructor(private readonly crudService: CrudService<LaborCost>) {
    super(crudService);
  }
}
