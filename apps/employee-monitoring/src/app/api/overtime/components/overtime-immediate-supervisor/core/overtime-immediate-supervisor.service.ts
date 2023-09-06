import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { OvertimeImmediateSupervisor } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OvertimeImmediateSupervisorService extends CrudHelper<OvertimeImmediateSupervisor> {
  constructor(private readonly crudService: CrudService<OvertimeImmediateSupervisor>) {
    super(crudService);
  }
}
