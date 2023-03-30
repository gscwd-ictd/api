import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { RequestedItem } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { ItemsService } from '../../../../../services/items';

@Injectable()
export class RequestedItemService extends CrudHelper<RequestedItem> {
  constructor(
    // inject crud service
    private readonly crudService: CrudService<RequestedItem>,

    // inject microservice client
    private readonly itemsService: ItemsService
  ) {
    super(crudService);
  }

  async findAllItemsByPr(id: string) {
    const items = (await this.crudService.findAll({
      find: {
        where: { prDetails: { id } },
      },
    })) as RequestedItem[];

    return await Promise.all(items.map(async (item) => ({ ...item, details: await this.getItemDetails(item.itemId) })));
  }

  async findAllItemsByRfq(id: string) {
    const items = (await this.crudService.findAll({
      find: {
        where: { requestForQuotation: { id } },
      },
    })) as RequestedItem[];

    return await Promise.all(items.map(async (item) => ({ ...item, details: await this.getItemDetails(item.itemId) })));
  }

  async getItemDetails(id: string) {
    return await this.itemsService.getItemById(id);
  }
}
