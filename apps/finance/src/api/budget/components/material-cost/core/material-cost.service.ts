import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ItemService } from '../../../../item/core/item.service';

@Injectable()
export class MaterialCostService extends CrudHelper<MaterialCostService> {
  constructor(private readonly crudService: CrudService<MaterialCostService>, private readonly itemService: ItemService) {
    super(crudService);
  }
}
