import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateRfqDto, RequestForQuotation } from '@gscwd-api/models';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class RequestForQuotationService extends CrudHelper<RequestForQuotation> {
  constructor(
    // inject crud service
    private readonly crudService: CrudService<RequestForQuotation>
  ) {
    super(crudService);
  }

  async createRawRfq(rfqDto: CreateRfqDto) {
    // deconstruct rfqDto object
    const { prId, items } = rfqDto;

    try {
      // call the create_pr() stored function
      const result = await this.crudService.getRepository().query('SELECT * FROM create_rfq($1, $2)', [prId, JSON.stringify(items)]);

      // this query will return an arrat, thus, return the first element
      return result[0];

      // catch resulting error
    } catch (error) {
      throw new BadRequestException(error.message, { cause: new Error() });
    }
  }
}
