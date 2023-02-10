import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreatePurchaseRequestDto, PurchaseRequestDetails, RequestedItem } from '@gscwd-api/models';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemsService } from '../../../../../services/items';
import { OrgStructureService } from '../../../../../services/hrms/components/org-structure';
import { QueryFailedError } from 'typeorm';

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

  async findPurchaseRequestById(id: string) {
    try {
      // intialize transaction for multiple table select
      return await this.crudService.getManager().transaction(async (transactionManager) => {
        // query purchase details
        const details = await transactionManager.getRepository(PurchaseRequestDetails).findOneBy({ id });

        // query all requested items associated with the purchase details
        const items = await transactionManager.getRepository(RequestedItem).find({
          // only select quantity and remarks from requested_items
          select: { quantity: true, remarks: true, itemId: true },

          // where clause
          where: { details: { id } },
        });

        // get information about the org entity that created this purchase request via hrms microservice
        const orgInfo = await this.orgStructureService.getOrgUnitById(details.requestingOffice);

        // get information about the items that were requested in this purchase request
        const itemInfo = await Promise.all(items.map(async (item) => ({ ...item, itemInfo: await this.itemsService.getItemById(item.itemId) })));

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
