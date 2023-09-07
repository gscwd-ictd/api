import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { OvertimeApproval } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OvertimeApprovalService extends CrudHelper<OvertimeApproval> {
  constructor(private readonly crudService: CrudService<OvertimeApproval>) {
    super(crudService);
  }
}
