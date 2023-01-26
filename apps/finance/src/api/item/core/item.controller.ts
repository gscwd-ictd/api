import { DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ItemService } from './item.service';

export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number
  ) {
    return await this.itemService.findAllItems({ page, limit });
  }

  @Get(':id')
  async findById(@Param() id: string) {
    return await this.itemService.findItemById(id);
  }
}
