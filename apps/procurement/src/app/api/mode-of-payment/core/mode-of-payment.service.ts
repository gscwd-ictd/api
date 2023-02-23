import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ModeofPayment } from '../data/mode-of-payment.entity';

@Injectable()
export class ModeOfPaymentService extends CrudHelper<ModeofPayment> {
  constructor(private readonly crudService: CrudService<ModeofPayment>) {
    super(crudService);
  }
}
