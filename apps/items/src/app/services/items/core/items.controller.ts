import { ItemDetailsViewPatterns } from '@gscwd-api/microservices';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ItemsService } from './items.service';

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @MessagePattern(ItemDetailsViewPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.itemsService.findAll(page, limit);
  }

  @MessagePattern(ItemDetailsViewPatterns.FIND_BY_ID)
  async findOneBy(@Payload('id') id: string) {
    return await this.itemsService.findOneBy(id);
  }
}
