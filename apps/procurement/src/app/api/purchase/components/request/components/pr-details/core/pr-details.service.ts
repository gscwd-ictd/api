import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreatePrDto, PurchaseRequest } from '@gscwd-api/models';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class PrDetailsService extends CrudHelper<PurchaseRequest> {
  constructor(private readonly crudService: CrudService<PurchaseRequest>) {
    super(crudService);
  }

  async tx_createPrDetails(manager: EntityManager, prDetailsDto: CreatePrDto) {
    return await this.crud()
      .transact<PurchaseRequest>(manager)
      .create({
        dto: prDetailsDto,
        onError: () => new BadRequestException({ message: 'Failed to create pr details' }, { cause: new Error() }),
      });
  }

  async tx_findPrDetails(manager: EntityManager, id: string) {
    return await this.crud()
      .transact<PurchaseRequest>(manager)
      .findOneBy({
        findBy: { id },
        onError: () => new NotFoundException(),
      });
  }
}
