import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MajorAccountGroup } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MajorAccountGroupService extends CrudHelper<MajorAccountGroup> {
  constructor(private readonly crudService: CrudService<MajorAccountGroup>) {
    super(crudService);
  }
}
