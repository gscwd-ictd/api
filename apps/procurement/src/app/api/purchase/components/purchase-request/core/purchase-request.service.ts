import { PurchaseRequestDetails } from '@gscwd-api/models';
import { keysToSnake, RawPurchaseRequest } from '@gscwd-api/utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { DataSource } from 'typeorm';
import { RequestedItemService } from '../../requested-item';
import { CreatePrDto } from '../data/pr.dto';
import { OrgStructureService } from '../../../../../services/hrms/components/org-structure';
import { CostEstimateService } from '../../../../../services/finance/components/cost-estimate';

@Injectable()
export class PurchaseRequestService {
  constructor(
    // inject datasource
    private readonly datasource: DataSource,

    // inject requested items service
    private readonly requestedItemService: RequestedItemService,

    // inject org structure service
    private readonly orgStructureService: OrgStructureService,

    // inject cost estimates service
    private readonly costEstimateService: CostEstimateService
  ) {}

  async createPr(prDto: CreatePrDto): Promise<RawPurchaseRequest> {
    // deconstruct the prDto object to extract each field
    const {
      details: { projectDetailsId, requestingOffice, purpose, deliveryPlace, purchaseType },
      items,
    } = prDto;

    try {
      // call the create_pr() stored function
      const result = await this.datasource.query('SELECT * FROM create_pr($1, $2, $3, $4, $5, $6)', [
        projectDetailsId,
        requestingOffice,
        purpose,
        deliveryPlace,
        purchaseType,
        JSON.stringify(keysToSnake(items)),
      ]);

      // this query will return an arrat, thus, return the first element
      return result[0];

      // catch resulting error
    } catch (error) {
      throw new BadRequestException(error, { cause: new Error() });
    }
  }

  async findAllPrs({ page, limit }: IPaginationOptions) {
    return await paginate(
      this.datasource.getRepository(PurchaseRequestDetails),
      { page, limit },
      {
        select: {
          id: true,
          code: true,
          requestingOffice: true,
          purpose: true,
          deliveryPlace: true,
          status: true,
        },
      }
    );
  }

  async getPrDetails(id: string) {
    try {
      // get pr details
      const prDetails = await this.datasource.getRepository(PurchaseRequestDetails).findOneByOrFail({ id });

      // get requesting office details
      const requestingOffice = (await this.orgStructureService.getOrgUnitById(prDetails.requestingOffice)).name;

      // get project details from finance
      const projectDetails = await this.costEstimateService.getProjectDetailsById(prDetails.projectDetailsId);

      // get details on requested items
      const requestedItems = await this.requestedItemService.findAllItemsByPr(prDetails.id);

      // return resulting values
      return { ...prDetails, projectDetails, requestingOffice, requestedItems };

      // catch any error
    } catch (error) {
      // throw not found
      throw new NotFoundException();
    }
  }
}
