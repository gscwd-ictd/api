import { ItemDetails } from '@gscwd-api/models';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DetailsService extends CrudHelper<ItemDetails> {
  constructor(private readonly crudService: CrudService<ItemDetails>) {
    super(crudService);
  }
}
