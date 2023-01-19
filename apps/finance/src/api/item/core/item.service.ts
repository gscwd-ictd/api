import { ItemPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { Item, ItemDetails } from '@gscwd-api/utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class ItemService {
  constructor(private readonly client: MicroserviceClient) {}

  async findAllItems(options: IPaginationOptions): Promise<Pagination<Item>> {
    return await this.client.send({
      pattern: ItemPatterns.FIND_ALL,
      payload: options,
      onError: () => new BadRequestException(),
    });
  }

  async findItemById(id: string): Promise<ItemDetails> {
    return await this.client.send({
      pattern: ItemPatterns.FIND_BY_ID,
      payload: id,
      onError: (error) => new NotFoundException(error),
    });
  }
}
