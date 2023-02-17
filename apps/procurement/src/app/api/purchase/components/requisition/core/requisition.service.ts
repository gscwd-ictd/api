import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreatePurchaseRequestDto, PurchaseRequestDetails, RequestedItem } from '@gscwd-api/models';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemsService } from '../../../../../services/items';
import { OrgStructureService } from '../../../../../services/hrms/components/org-structure';
import { QueryFailedError } from 'typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class PurchaseRequisitionService extends CrudHelper<PurchaseRequestDetails> {
  constructor(
    // inject crud service
    private readonly crudService: CrudService<PurchaseRequestDetails>,

    // inject items service
    private readonly itemsService: ItemsService,

    // inject org structure service
    private readonly orgStructureService: OrgStructureService
  ) {
    super(crudService);
  }

  async findAllPurchaseRequests({ page, limit }: IPaginationOptions) {
    // query all details from the database
    const details = (await this.crudService.findAll({ pagination: { page, limit } })) as Pagination<PurchaseRequestDetails>;

    // await for all promises to settle
    const orgInfo = await Promise.all(
      // map through all queried details
      details.items.map(async (item) => {
        // get the name of requesting office from hrms microservice, passing the requestor id
        const requestingOffice = (await this.orgStructureService.getOrgUnitById(item.requestingOffice)).name;

        // return the resulting value as orgInfo
        return { ...item, requestingOffice };
      })
    );

    // return the resulting value
    return { ...details, items: [...orgInfo] };
  }

  async findPurchaseRequestById(id: string) {
    try {
      // intialize transaction for multiple table select
      return await this.crudService.getManager().transaction(async (transactionManager) => {
        // query purchase details
        const details = await transactionManager.getRepository(PurchaseRequestDetails).findOne({
          // select fields
          select: {
            id: true,
            code: true,
            requestingOffice: true,
            purpose: true,
            status: true,
            deliveryPlace: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          },

          // where clause
          where: { id },
        });

        // query all requested items associated with the purchase details
        const items = await transactionManager.getRepository(RequestedItem).find({
          // only select quantity and remarks from requested_items
          select: { quantity: true, remarks: true, itemId: true },

          // where clause
          where: { details: { id } },
        });

        // get information about the org entity that created this purchase request via hrms microservice
        const orgInfo = await this.orgStructureService.getOrgUnitById(details.requestingOffice);

        // get information about the items that were requested in this purchase request via items
        const itemInfo = await Promise.all(items.map(async (item) => ({ ...item, info: await this.itemsService.getItemById(item.itemId) })));

        // return result
        return { purchaseDetails: { ...details, requestingOffice: orgInfo.name }, requestedItems: itemInfo };
      });

      // catch resulting error
    } catch (error) {
      // throw not found error
      throw new NotFoundException();
    }
  }

  async createPurchaseRequest(purchaseRequestDto: CreatePurchaseRequestDto) {
    // deconstruct purchaseRequestDto
    const { details, items } = purchaseRequestDto;

    // initialize transaction for multiple table inserts
    return await this.crudService.getManager().transaction(async (transactionManager) => {
      try {
        // create an instance of PurchaseRequestDetails
        const createdDetails = this.crudService.getRepository().create(details);

        // modify the items array to inject the newly created PurchaseRequestDetails as a foreign entity for RequestedItems
        const createdItems = items.map((item) => ({ ...item, details: createdDetails })) as RequestedItem[];

        // save the purchase request details in the database
        const requestDetails = await transactionManager.save(createdDetails);

        // save the requested items in the database
        const requestedItems = await transactionManager.getRepository(RequestedItem).save(createdItems);

        // make sure all promises are settled
        return { requestDetails, requestedItems };

        // catch any resulting errors
      } catch (error) {
        // initialize error as QueryFailedError
        const myError = error as QueryFailedError;

        // throw BadRequest and pass in driverError object
        throw new BadRequestException(myError.name, { cause: myError, description: myError.message });
      }
    });
  }
}
