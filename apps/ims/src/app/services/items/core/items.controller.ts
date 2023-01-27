import { Controller, Get, Param, ParseUUIDPipe, Query, UseInterceptors } from '@nestjs/common';
import { FindAllItemsInterceptor, FindItemByIdInterceptor } from '../../../../global/interceptors';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ItemsService } from './items.service';

@Controller({ version: '1', path: 'items' })
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @UseInterceptors(FindAllItemsInterceptor)
  @Get()
  async findAll(@Query() options: IPaginationOptions) {
    return await this.itemsService.findAllItemsFromView(options);
  }

  @UseInterceptors(FindItemByIdInterceptor)
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.itemsService.findItemFromViewById(id);
  }
}
