import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateRfqDto, RequestForQuotation } from '@gscwd-api/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { RequestedItemService } from '../../requested-item';

@Injectable()
export class RequestForQuotationService extends CrudHelper<RequestForQuotation> {
  constructor(
    // inject crud service
    private readonly crudService: CrudService<RequestForQuotation>,

    // inject requested item service
    private readonly requestedItemService: RequestedItemService
  ) {
    super(crudService);
  }

  async createRfq(rfqDto: CreateRfqDto) {
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

  async findAllRfqs({ page, limit }: IPaginationOptions) {
    return await this.crudService.findAll({ pagination: { page, limit } });
  }

  async getRfqDetails(id: string) {
    const rfq = await this.crudService.findOne({
      find: {
        where: { id },
        relations: { prDetails: { purchaseType: true } },
        select: {
          prDetails: {
            id: true,
            code: true,
            purchaseType: { type: true },
            purpose: true,
            deliveryPlace: true,
          },
        },
      },
    });
    const requestedItems = await this.requestedItemService.findAllItemsByRfq(rfq.id);

    return { ...rfq, requestedItems };
  }
}
