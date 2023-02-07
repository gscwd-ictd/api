import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { PassSlipApproval } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PassSlipApprovalService extends CrudHelper<PassSlipApproval> {
  constructor(private readonly crudService: CrudService<PassSlipApproval>) {
    super(crudService);
  }
}
