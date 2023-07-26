import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LeaveAddBack } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaveAddBackService extends CrudHelper<LeaveAddBack> {
  constructor(private readonly crudService: CrudService<LeaveAddBack>) {
    super(crudService);
  }
}
