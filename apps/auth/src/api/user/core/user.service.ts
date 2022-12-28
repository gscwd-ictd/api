import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { User } from '../data/user.entity';

@Injectable()
export class UserService extends CrudHelper<User> {
  constructor(private readonly crudService: CrudService<User>) {
    super(crudService);
  }
}
