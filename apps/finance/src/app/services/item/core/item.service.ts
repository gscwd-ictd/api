import { ItemsViewPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { ItemDetailsFromView } from '@gscwd-api/utils';
import { HttpException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class ItemService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  async findAllItemsFromView({ page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemsViewPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findItemFromViewById(id: string): Promise<ItemDetailsFromView> {
    return (await this.microserviceClient.call({
      action: 'send',
      pattern: ItemsViewPatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    })) as ItemDetailsFromView;
  }
}
