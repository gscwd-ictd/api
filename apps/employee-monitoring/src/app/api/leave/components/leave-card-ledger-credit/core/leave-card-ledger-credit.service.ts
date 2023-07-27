import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LeaveCardLedgerCredit } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaveCardLedgerCreditService extends CrudHelper<LeaveCardLedgerCredit> {
  constructor(private readonly crudService: CrudService<LeaveCardLedgerCredit>) {
    super(crudService);
  }
}
