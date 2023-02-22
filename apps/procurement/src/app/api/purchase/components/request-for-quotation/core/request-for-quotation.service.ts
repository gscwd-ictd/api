import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateRfqDto, RequestForQuotation } from '@gscwd-api/models';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { DataSource, EntityManager } from 'typeorm';
import { RequestedItemService } from '../../requested-item/core/requested-item.service';
import { CreateQuotationRequestDto } from '../data/rfq.dto';

@Injectable()
export class RequestForQuotationService extends CrudHelper<RequestForQuotation> {
  constructor(
    // inject crud service
    private readonly crudService: CrudService<RequestForQuotation>,

    // inject requested items service
    private readonly requestedItemService: RequestedItemService,

    // inject datasource
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  async tx_create(manager: EntityManager, rfqDto: CreateRfqDto) {
    return await this.crudService.transact<RequestForQuotation>(manager).create({
      dto: rfqDto,
      onError: () => new BadRequestException(),
    });
  }

  async tx_findById(manager: EntityManager, id: string) {
    return await this.crudService.transact<RequestForQuotation>(manager).findOneBy({ findBy: { id }, onError: () => new NotFoundException() });
  }

  async createRfq(rfqDto: CreateQuotationRequestDto) {
    // deconstruct rfq object
    const { items, details } = rfqDto;

    return await this.datasource.manager.transaction(async (manager) => {
      // create request for quotation details
      const requestForQuotation = await this.tx_create(manager, details);

      // await for this process to complete
      const itemsForQuotation = await Promise.all(
        // loop through all items
        items.map(async (item) => {
          // find requested item by id
          const requestedItem = await this.requestedItemService.tx_findItemById(manager, item.id);

          // update requested item to add rfq
          return await this.requestedItemService.tx_setItemForRfq(manager, requestedItem, requestForQuotation);
        })
      );

      return { rfq: requestForQuotation, items: itemsForQuotation.length };
    });
  }

  async findAllRfqs({ page, limit }: IPaginationOptions) {
    return await this.crudService.findAll({
      pagination: { page, limit },
      find: {
        relations: { purchaseRequest: { purchaseType: true } },
        select: {
          purchaseRequest: {
            code: true,
            purchaseType: { type: true },
            status: true,
          },
        },
      },
    });
  }

  async findRfqById(id: string) {
    return await this.datasource.manager.transaction(async (manager) => {
      // find rfq details by id
      const rfq = await this.tx_findById(manager, id);

      // find all items by request_for_quotation id
      const items = await this.requestedItemService.tx_findItemsByRfqDetailsId(manager, id);

      // get item info via items microservice
      const itemInfo = await this.requestedItemService.ms_getItemsInfo(items);

      // return resulting values
      return { rfq, items: itemInfo };
    });
  }
}
