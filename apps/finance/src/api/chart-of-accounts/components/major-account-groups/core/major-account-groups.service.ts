import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { MajorAccountGroup } from '../data/major-account-groups.entity';

@Injectable()
export class MajorAccountGroupService extends CrudHelper<MajorAccountGroup> {
  constructor(private readonly crudService: CrudService<MajorAccountGroup>) {
    super(crudService);
  }
}
