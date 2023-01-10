import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { TestEntity } from './test.entity';

@Injectable()
export class TestService extends CrudHelper<TestEntity> {
  constructor(private readonly crudService: CrudService<TestEntity>) {
    super(crudService);
  }
}
