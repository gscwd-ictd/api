import { PpeCategory } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PpeCategoriesService extends CrudHelper<PpeCategory> {
  constructor(private readonly crudService: CrudService<PpeCategory>) {
    super(crudService);
  }
}
