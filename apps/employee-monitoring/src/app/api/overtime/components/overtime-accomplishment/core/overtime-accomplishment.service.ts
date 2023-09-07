import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { OvertimeAccomplishment } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OvertimeAccomplishmentService extends CrudHelper<OvertimeAccomplishment> {
  constructor(private readonly crudService: CrudService<OvertimeAccomplishment>) {
    super(crudService);
  }
}
