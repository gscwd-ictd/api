import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Tag } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagsService extends CrudHelper<Tag> {
  constructor(private readonly crudService: CrudService<Tag>) {
    super(crudService);
  }
}
