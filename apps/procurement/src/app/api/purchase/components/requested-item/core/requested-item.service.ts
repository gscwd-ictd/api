import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { RequestedItem } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestedItemService extends CrudHelper<RequestedItem> {
  constructor(private readonly crudService: CrudService<RequestedItem>) {
    super(crudService);
  }
}
