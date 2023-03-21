import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BudgetType } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetTypeService extends CrudHelper<BudgetType> {
  constructor(private readonly crudService: CrudService<BudgetType>) {
    super(crudService);
  }
}
