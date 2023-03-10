import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BudgetDetail } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetDetailService extends CrudHelper<BudgetDetail> {
  constructor(private readonly crudService: CrudService<BudgetDetail>) {
    super(crudService);
  }
}
