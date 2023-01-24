import { ItemPpeDetailsView } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsPpeService extends CrudHelper<ItemPpeDetailsView> {
  constructor(private readonly crudService: CrudService<ItemPpeDetailsView>) {
    super(crudService);
  }
}
