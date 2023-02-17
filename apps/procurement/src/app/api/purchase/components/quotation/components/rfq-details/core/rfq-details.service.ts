import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateRfqDto, RequestForQuotation } from '@gscwd-api/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class RfqDetailsService extends CrudHelper<RequestForQuotation> {
  constructor(private readonly crudService: CrudService<RequestForQuotation>) {
    super(crudService);
  }

  async tx_createRfqDetails(manager: EntityManager, rfqDetailsDto: CreateRfqDto) {
    return await this.crud()
      .transact<RequestForQuotation>(manager)
      .create({
        dto: rfqDetailsDto,
        onError: () => new BadRequestException(),
      });
  }
}
