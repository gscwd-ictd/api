import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { TermsofPayment } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TermsOfPaymentService extends CrudHelper<TermsofPayment> {
  constructor(private readonly crudService: CrudService<TermsofPayment>) {
    super(crudService);
  }
}
