import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { OvertimeApplication } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OvertimeApplicationService extends CrudHelper<OvertimeApplication> {
  constructor(private readonly crudService: CrudService<OvertimeApplication>) {
    super(crudService);
  }
  async createOvertimeApplication() {
    return '';
  }
}
