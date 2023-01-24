import { ItemPpeDetailsPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { Controller, Get, HttpException, Param, ParseUUIDPipe, Query, UseInterceptors } from '@nestjs/common';
import { FindAllItemsInterceptor, FindItemByIdInterceptor } from 'apps/ims/src/global/interceptors';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ version: '1', path: 'items-ppe' })
export class ItemsPpeController {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  @UseInterceptors(FindAllItemsInterceptor)
  @Get()
  async findAllItemsAndPpeFromView(@Query() { page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemPpeDetailsPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @UseInterceptors(FindItemByIdInterceptor)
  @Get(':id')
  async findItemFromViewById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemPpeDetailsPatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
