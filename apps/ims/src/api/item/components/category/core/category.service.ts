import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ItemCategory } from '../data/category.entity';

@Injectable()
export class CategoryService extends CrudHelper<ItemCategory> {
  constructor(private readonly crudService: CrudService<ItemCategory>) {
    super(crudService);
  }
}
