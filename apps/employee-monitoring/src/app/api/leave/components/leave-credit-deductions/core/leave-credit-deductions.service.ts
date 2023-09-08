import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LeaveCreditDeductions } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaveCreditDeductionsService extends CrudHelper<LeaveCreditDeductions> {
  constructor(private readonly crudService: CrudService<LeaveCreditDeductions>) {
    super(crudService);
  }
}
