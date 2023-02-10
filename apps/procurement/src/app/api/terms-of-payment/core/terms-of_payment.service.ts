import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { TermsofPayment } from '../data/terms-of-payment.entity';

@Injectable()
export class TermsOfPaymentService extends CrudHelper<TermsofPayment> {
  constructor(private readonly crudService: CrudService<TermsofPayment>) {
    super(crudService);
  }
}
