import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller({ version: '1', path: 'items' })
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async getAllItems(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.itemsService.getAllItems({ page, limit });
  }

  @Get(':id')
  async getItemById(@Param('id') id: string) {
    return await this.itemsService.getItemById(id);
  }
}
