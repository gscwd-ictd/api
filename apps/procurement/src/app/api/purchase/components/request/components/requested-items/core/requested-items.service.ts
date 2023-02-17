import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateRequestedItemDto, PurchaseRequest, RequestedItem, RequestForQuotation } from '@gscwd-api/models';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ItemsService } from '../../../../../../../services/items';
import { EntityManager } from 'typeorm';

@Injectable()
export class RequestedItemsService extends CrudHelper<RequestedItem> {
  constructor(
    // inject crud service
    private readonly crudService: CrudService<RequestedItem>,

    // inject items service
    private readonly itemsService: ItemsService
  ) {
    super(crudService);
  }

  async ms_getItemInfo(items: RequestedItem[]) {
    return await Promise.all(items.map(async (item) => ({ ...item, info: await this.itemsService.getItemById(item.itemId) })));
  }

  async tx_createRequestedItem(manager: EntityManager, itemsDto: CreateRequestedItemDto[], purchaseRequest: PurchaseRequest) {
    return await Promise.all(
      itemsDto.map(async (item) => {
        return await this.crud()
          .transact<RequestedItem>(manager)
          .create({
            dto: { ...item, purchaseRequest },
            onError: () => new BadRequestException({ message: 'Failed to create requested items' }, { cause: new Error() }),
          });
      })
    );
  }

  async tx_findItemById(manager: EntityManager, id: string) {
    return await this.crud()
      .transact<RequestedItem>(manager)
      .findOneBy({
        findBy: { id },
        onError: () => new NotFoundException(),
      });
  }

  async tx_findItemsByPrDetailsId(manager: EntityManager, id: string) {
    return (await this.crud()
      .transact<RequestedItem>(manager)
      .findAll({
        find: { where: { purchaseRequest: { id } } },
        onError: () => new InternalServerErrorException(),
      })) as RequestedItem[];
  }

  async tx_updateItemForRfq(manager: EntityManager, requestedItem: RequestedItem, requestForQuotation: RequestForQuotation) {
    return await this.crud()
      .transact<RequestedItem>(manager)
      .update({
        updateBy: { id: requestedItem.id },
        dto: { ...requestedItem, requestForQuotation },
        onError: () => new BadRequestException(),
      });
  }
}
