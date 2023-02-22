import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateRequestedItemDto, PurchaseRequest, RequestedItem, RequestForQuotation } from '@gscwd-api/models';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ItemsService } from '../../../../../services/items';
import { EntityManager } from 'typeorm';

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

  async ms_getItemsInfo(items: RequestedItem[]) {
    return await Promise.all(items.map(async (item) => ({ ...item, info: await this.itemsService.getItemById(item.itemId) })));
  }

  async tx_addRequestedItem(manager: EntityManager, itemsDto: CreateRequestedItemDto[], purchaseRequest: PurchaseRequest) {
    return await Promise.all(
      itemsDto.map(async (item) => {
        return await this.crudService.transact<RequestedItem>(manager).create({
          dto: { ...item, purchaseRequest },
          onError: () => new BadRequestException(),
        });
      })
    );
  }

  async tx_findItemById(manager: EntityManager, id: string) {
    return await this.crudService.transact<RequestedItem>(manager).findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  async tx_findItemsByPrDetailsId(manager: EntityManager, prId: string) {
    return (await this.crudService.transact<RequestedItem>(manager).findAll({
      find: { where: { purchaseRequest: { id: prId } } },
      onError: () => new InternalServerErrorException(),
    })) as RequestedItem[];
  }

  async tx_findItemsByRfqDetailsId(manager: EntityManager, rfqId: string) {
    return (await this.crudService.transact<RequestedItem>(manager).findAll({
      find: { where: { requestForQuotation: { id: rfqId } } },
      onError: () => new InternalServerErrorException(),
    })) as RequestedItem[];
  }

  async tx_setItemForRfq(manager: EntityManager, requestedItem: RequestedItem, requestForQuotation: RequestForQuotation) {
    return await this.crudService.transact<RequestedItem>(manager).update({
      updateBy: { id: requestedItem.id },
      dto: { ...requestedItem, requestForQuotation },
      onError: () => new BadRequestException(),
    });
  }
}
