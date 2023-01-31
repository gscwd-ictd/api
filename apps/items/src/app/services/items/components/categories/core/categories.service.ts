import { ItemCategory } from '@gscwd-api/models';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService extends CrudHelper<ItemCategory> {
  constructor(private readonly crudService: CrudService<ItemCategory>) {
    super(crudService);
  }
}
