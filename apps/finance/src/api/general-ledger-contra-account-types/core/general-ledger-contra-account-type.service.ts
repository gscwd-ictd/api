import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { GeneralLedgerContraAccountType } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneralLedgerContraAccountTypeService extends CrudHelper<GeneralLedgerContraAccountType> {
  constructor(private readonly crudService: CrudService<GeneralLedgerContraAccountType>) {
    super(crudService);
  }
}
