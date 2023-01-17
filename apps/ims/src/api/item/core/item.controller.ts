import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { FindItemByIdInterceptor } from '../misc/item.interceptor';
import { FindAllItemsInterceptor } from '../misc/items.interceptor';
import { ItemService } from './item.service';

@Controller({ version: '1', path: 'items' })
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseInterceptors(FindAllItemsInterceptor)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.itemService.findAllItems({ page, limit });
  }

  @UseInterceptors(FindItemByIdInterceptor)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.itemService.findItemById(id);
  }
}
