import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreatePrDto, PurchaseRequest } from '@gscwd-api/models';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrgStructureService } from '../../../../../services/hrms/components/org-structure';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { DataSource, EntityManager } from 'typeorm';
import { RequestedItemService } from '../../requested-item/core/requested-item.service';
import { CreatePurchaseRequestDto } from '../data/pr.dto';

@Injectable()
export class PurchaseRequestService extends CrudHelper<PurchaseRequest> {
  constructor(
    // inject crud service
    private readonly crudService: CrudService<PurchaseRequest>,

    // inject requested items service
    private readonly requestedItemService: RequestedItemService,

    // inject org struct service
    private readonly orgStructureService: OrgStructureService,

    // inject datasource
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  async tx_create(manager: EntityManager, prDto: CreatePrDto) {
    return await this.crudService.transact<PurchaseRequest>(manager).create({
      dto: prDto,
      onError: () => new BadRequestException(),
    });
  }

  async tx_findById(manager: EntityManager, id: string) {
    return await this.crudService.transact<PurchaseRequest>(manager).findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  async createPr(purchaseRequest: CreatePurchaseRequestDto) {
    // deconstruct pr object
    const { details, items } = purchaseRequest;

    return await this.datasource.manager.transaction(async (manager) => {
      // create new purchase request
      const pr = await this.tx_create(manager, details);

      // add requested items
      const requestedItems = await this.requestedItemService.tx_addRequestedItem(manager, items, pr);

      // return resulting values
      return { details: pr, items: requestedItems.length };
    });
  }

  async findAllPrs({ page, limit }: IPaginationOptions) {
    // find all purchase details from database
    const pr = (await this.crud().findAll({
      pagination: { page, limit },
      find: {
        relations: { purchaseType: true },
        select: {
          id: true,
          code: true,
          purpose: true,
          purchaseType: { type: true },
          status: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      },
    })) as Pagination<PurchaseRequest>;

    // return value
    return { ...pr };
  }

  async findPrById(id: string) {
    return await this.datasource.manager.transaction(async (manager) => {
      // find pr details by id
      const pr = await this.tx_findById(manager, id);

      // find all items by purchase details id
      const items = await this.requestedItemService.tx_findItemsByPrDetailsId(manager, id);

      // get item info via items microservice
      const itemInfo = await this.requestedItemService.ms_getItemsInfo(items);

      // get org name via hrms microservice
      const { name } = await this.orgStructureService.getOrgUnitById(pr.requestingOffice);

      // return resulting value
      return { ...pr, purpose: pr.purpose, placeOfDelivery: pr.deliveryPlace, requestingOffice: name, items: itemInfo };
    });
  }
}
