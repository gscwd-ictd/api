import { Controller, Get, Param } from '@nestjs/common';
import { RequestedItemService } from './requested-item.service';

@Controller({ version: '1', path: '/requested-items' })
export class RequestedItemController {
  constructor(private readonly requestedItemService: RequestedItemService) {}

  @Get('pr/:id')
  async findAllItemsByPrId(@Param('id') id: string) {
    return await this.requestedItemService.crud().findAll({ find: { where: { prDetails: { id } } } });
  }
}
