import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { AccountGroup } from '../data/account-groups.entity';

@Injectable()
export class AccountGroupService extends CrudHelper<AccountGroup> {
  constructor(private readonly crudService: CrudService<AccountGroup>) {
    super(crudService);
  }
}
