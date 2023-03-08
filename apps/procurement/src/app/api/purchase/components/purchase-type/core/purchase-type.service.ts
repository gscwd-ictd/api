import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { PurchaseType } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PurchaseTypeService extends CrudHelper<PurchaseType> {
  constructor(private readonly crudService: CrudService<PurchaseType>) {
    super(crudService);
  }
}
