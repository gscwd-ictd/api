import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { RequestedItem } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { ItemsService } from '../../../../../services/items';

@Injectable()
export class RequestedItemService extends CrudHelper<RequestedItem> {
  constructor(
    // inject crud service
    private readonly crudService: CrudService<RequestedItem>,

    // inject items service
    private readonly itemsService: ItemsService
  ) {
    super(crudService);
  }
}
