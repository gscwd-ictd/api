import { RawPurchaseRequest } from '@gscwd-api/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreatePrDto } from '../data/pr.dto';

@Injectable()
export class PurchaseRequestService {
  constructor(private readonly datasource: DataSource) {}

  async createRawPr(prDto: CreatePrDto): Promise<RawPurchaseRequest> {
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
}
