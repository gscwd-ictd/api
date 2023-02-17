import { PurchaseRequest } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { OrgStructureService } from '../../../../../services/hrms/components/org-structure';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { DataSource } from 'typeorm';
import { PrDetailsService, RequestedItemsService } from '../components';
import { CreatePurchaseRequestDto } from '../data/pr.dto';

@Injectable()
export class PrService {
  constructor(
    // inject purchase request details service
    private readonly prDetailsService: PrDetailsService,

    // inject requested items service
    private readonly requestedItemsService: RequestedItemsService,

    // inject org struct service
    private readonly orgStructService: OrgStructureService,

    // inject datasource
    private readonly datasource: DataSource
  ) {}

  async createPr(pr: CreatePurchaseRequestDto) {
    // deconstruct pr object
    const { details, items } = pr;

    // intialize transaction
    return await this.datasource.manager.transaction(async (manager) => {
      // insert purchase request details
      const prDetails = await this.prDetailsService.tx_createPrDetails(manager, details);

      // insert requested items
      const requestedItems = await this.requestedItemsService.tx_createRequestedItem(manager, items, prDetails);

      // return newly created purchase request
      return { prDetails, requestedItems: requestedItems.length };
    });
  }

  async findAllPrs({ page, limit }: IPaginationOptions) {
    // find all purchase details from database
    const prDetails = (await this.prDetailsService.crud().findAll({ pagination: { page, limit } })) as Pagination<PurchaseRequest>;

    // await this map process
    const items = await Promise.all(
      // loop through all details items
      prDetails.items.map(async (item) => {
        // get org name via hrms microservice
        const { name } = await this.orgStructService.getOrgUnitById(item.requestingOffice);

        // return value
        return { ...item, requestingOffice: name };
      })
    );

    // return value
    return { ...prDetails, items };
  }

  async findPrById(id: string) {
    // initialize transaction
    return await this.datasource.manager.transaction(async (manager) => {
      // find pr details by id
      const prDetails = await this.prDetailsService.tx_findPrDetails(manager, id);

      // find all items by purchase details id
      const items = await this.requestedItemsService.tx_findItemsByPrDetailsId(manager, id);

      // get org name via hrms microservice
      const { name } = await this.orgStructService.getOrgUnitById(prDetails.requestingOffice);

      // get item details via items microservice
      const requestedItems = await this.requestedItemsService.ms_getItemInfo(items);

      // return value
      return { ...prDetails, purpose: prDetails.purpose, deliveryPlace: prDetails.deliveryPlace, requestingOffice: name, requestedItems };
    });
  }
}
