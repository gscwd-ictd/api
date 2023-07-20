import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LeaveCreditEarnings } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaveCreditEarningsService extends CrudHelper<LeaveCreditEarnings> {
  constructor(private readonly crudService: CrudService<LeaveCreditEarnings>) {
    super(crudService);
  }
}
