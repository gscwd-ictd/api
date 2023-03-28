import { ItemsViewPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { ItemInformation, ItemSummary } from '@gscwd-api/utils';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class ItemsService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  async getAllItems({ page, limit }: IPaginationOptions) {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: ItemsViewPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as Pagination<ItemInformation>;
  }

  async getItemById(id: string) {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: ItemsViewPatterns.FIND_BY_ID,
      payload: { id },
      onError: (error) => new NotFoundException(error),
    })) as ItemSummary;
  }

  async getItemBalance(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemsViewPatterns.GET_ITEM_BALANCE,
      payload: { id },
      onError: (error) => new NotFoundException(error),
    });
  }
}
