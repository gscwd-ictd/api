import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BudgetDetails } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetDetailsService extends CrudHelper<BudgetDetails> {
  constructor(private readonly crudService: CrudService<BudgetDetails>) {
    super(crudService);
  }
}
