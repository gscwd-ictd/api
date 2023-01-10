import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ValueAddedTax } from '../data/value-added-tax.entity';

@Injectable()
export class ValueAddedTaxService extends CrudHelper<ValueAddedTax> {
  constructor(private readonly crudService: CrudService<ValueAddedTax>) {
    super(crudService);
  }
}
