import { ItemDetailsViewPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class ItemService {
  constructor(private readonly client: MicroserviceClient) {}

  async findAllItems(options: IPaginationOptions) {
    return await this.client.call({
      action: 'send',
      pattern: ItemDetailsViewPatterns.FIND_ALL,
      payload: options,
      onError: () => new BadRequestException(),
    });
  }

  async findItemById(id: string) {
    return await this.client.call({
      action: 'send',
      pattern: ItemDetailsViewPatterns.FIND_BY_ID,
      payload: id,
      onError: (error) => new NotFoundException(error),
    });
  }
}
