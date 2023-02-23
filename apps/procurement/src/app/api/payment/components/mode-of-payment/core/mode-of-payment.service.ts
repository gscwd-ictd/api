import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { ModeofPayment } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModeOfPaymentService extends CrudHelper<ModeofPayment> {
  constructor(private readonly crudService: CrudService<ModeofPayment>) {
    super(crudService);
  }
}
