import { ItemPatterns, Items, MicroserviceHelper } from '@gscwd-api/microservices';
import { RawItem } from '@gscwd-api/utils';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class MaterialCostService extends MicroserviceHelper {
  constructor(
    @Inject('IMS_MICROSERVICE')
    private readonly client: ClientProxy
  ) {
    super(client);
  }

  async findAllItems(pagination: IPaginationOptions) {
    return await this.send<Pagination<RawItem>, IPaginationOptions, Items>({
      target: ItemPatterns.findAll,
      payload: pagination,
      onError: () => new BadRequestException(),
    });
  }

  async findItemById(id: string) {
    return await this.send<RawItem, string, Items>({
      target: ItemPatterns.findById,
      payload: id,
      onError: () => new NotFoundException(),
    });
  }
}
