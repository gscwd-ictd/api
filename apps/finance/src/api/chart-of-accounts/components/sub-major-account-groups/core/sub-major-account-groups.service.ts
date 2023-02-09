import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { SubMajorAccountGroup } from '../data/sub-major-account-groups.entity';

@Injectable()
export class SubMajorAccountGroupService extends CrudHelper<SubMajorAccountGroup> {
  constructor(private readonly crudService: CrudService<SubMajorAccountGroup>) {
    super(crudService);
  }
}
