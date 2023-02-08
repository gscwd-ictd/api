import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { MajorAccountGroup } from '../data/major-account-group.entity';

@Injectable()
export class MajorAccountGroupsService extends CrudHelper<MajorAccountGroup> {
  constructor(private readonly crudService: CrudService<MajorAccountGroup>) {
    super(crudService);
  }
}
