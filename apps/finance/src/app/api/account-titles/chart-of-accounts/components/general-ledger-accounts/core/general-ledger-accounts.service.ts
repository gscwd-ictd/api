import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { GeneralLedgerAccount } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneralLedgerAccountService extends CrudHelper<GeneralLedgerAccount> {
  constructor(private readonly crudService: CrudService<GeneralLedgerAccount>) {
    super(crudService);
  }
}
