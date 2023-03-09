import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { AccountGroup } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountGroupService extends CrudHelper<AccountGroup> {
  constructor(private readonly crudService: CrudService<AccountGroup>) {
    super(crudService);
  }
}
