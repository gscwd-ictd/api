import { PurchaseRequestDetails } from '@gscwd-api/models';
import { RawPurchaseRequest } from '@gscwd-api/utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { DataSource } from 'typeorm';
import { RequestedItemService } from '../../requested-item';
import { CreatePrDto } from '../data/pr.dto';

@Injectable()
export class PurchaseRequestService {
  constructor(
    // inject datasource
    private readonly datasource: DataSource,

    // inject requested items service
    private readonly requestedItemService: RequestedItemService
  ) {}

  async createPr(prDto: CreatePrDto): Promise<RawPurchaseRequest> {
    // deconstruct the prDto object to extract each field
    const {
      details: { accountId, projectId, requestingOffice, purpose, deliveryPlace, purchaseType },
      items,
    } = prDto;

    try {
      // call the create_pr() stored function
      const result = await this.datasource.query('SELECT * FROM create_pr($1, $2, $3, $4, $5, $6, $7)', [
        accountId,
        projectId,
        requestingOffice,
        purpose,
        deliveryPlace,
        purchaseType,
        JSON.stringify(items),
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
      const prDetails = await this.datasource.getRepository(PurchaseRequestDetails).findOneByOrFail({ id });

      const requestedItems = await this.requestedItemService.findAllItemsByPr(prDetails.id);

      return { ...prDetails, requestedItems };
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
