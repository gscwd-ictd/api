import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { PropertyCategory } from '../data/category.entity';

@Injectable()
export class CategoryService extends CrudHelper<PropertyCategory> {
  constructor(private readonly crudService: CrudService<PropertyCategory>) {
    super(crudService);
  }
}
