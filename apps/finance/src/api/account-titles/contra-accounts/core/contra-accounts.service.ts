import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { ContraAccount } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContraAccountService extends CrudHelper<ContraAccount> {
  constructor(private readonly crudService: CrudService<ContraAccount>) {
    super(crudService);
  }
}
