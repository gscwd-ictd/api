import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ItemsService } from './items.service';

@Controller({ version: '1', path: 'items' })
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(@Query() options: IPaginationOptions) {
    return await this.itemsService.findAllItemsFromView(options);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.itemsService.findItemByIdFromView(id);
  }
}
