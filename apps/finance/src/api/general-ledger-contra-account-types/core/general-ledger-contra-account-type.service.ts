import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { GeneralLedgerContraAccountType } from '../data/general-ledger-contra-account-types.entity';

@Injectable()
export class GeneralLedgerContraAccountTypeService extends CrudHelper<GeneralLedgerContraAccountType> {
  constructor(private readonly crudService: CrudService<GeneralLedgerContraAccountType>) {
    super(crudService);
  }
}
