import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LaborCost } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LaborCostService extends CrudHelper<LaborCost> {
  constructor(private readonly crudService: CrudService<LaborCost>) {
    super(crudService);
  }
}
