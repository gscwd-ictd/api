import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { SubMajorAccountGroup } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubMajorAccountGroupService extends CrudHelper<SubMajorAccountGroup> {
  constructor(private readonly crudService: CrudService<SubMajorAccountGroup>) {
    super(crudService);
  }
}
