import { Controller, Get, Param, Query } from '@nestjs/common';
import { RequestedItemService } from './requested-item.service';

@Controller({ version: '1', path: '/requested-items' })
export class RequestedItemController {
  constructor(private readonly requestedItemService: RequestedItemService) {}

  @Get('pr')
  async findAllItemsByPr(@Query('id') id: string) {
    return await this.requestedItemService.findAllItemsByPr(id);
  }

  @Get('details/:id')
  async getItemDetails(@Param('id') id: string) {
    return await this.requestedItemService.getItemDetails(id);
  }
}
