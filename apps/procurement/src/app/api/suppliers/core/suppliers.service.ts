import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Supplier } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SuppliersService extends CrudHelper<Supplier> {
  constructor(private readonly crudService: CrudService<Supplier>) {
    super(crudService);
  }
}
