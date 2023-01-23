import { MicroserviceClient, PpeDetailsViewPatterns } from '@gscwd-api/microservices';
import { Controller, Get, HttpException, Param, Query, UseInterceptors } from '@nestjs/common';
import { FindAllItemsInterceptor, FindItemByIdInterceptor } from '../../../../global/interceptors';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ version: '1', path: 'ppe' })
export class PpeController {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  @UseInterceptors(FindAllItemsInterceptor)
  @Get()
  async findAllPpeFromView(@Query() { page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: PpeDetailsViewPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @UseInterceptors(FindItemByIdInterceptor)
  @Get(':id')
  async findPpeFromViewById(@Param('id') id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: PpeDetailsViewPatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
