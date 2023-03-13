import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { ValueAddedTax } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValueAddedTaxService extends CrudHelper<ValueAddedTax> {
  constructor(private readonly crudService: CrudService<ValueAddedTax>) {
    super(crudService);
  }
}
