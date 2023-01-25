import { ItemPpeDetailsPatterns } from '@gscwd-api/microservices';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ItemsPpeService } from './items-ppe.service';

@Controller()
export class ItemsPpeController {
  constructor(private readonly itemsPpeService: ItemsPpeService) {}

  @MessagePattern(ItemPpeDetailsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.itemsPpeService.findAll(page, limit);
  }

  @MessagePattern(ItemPpeDetailsPatterns.FIND_BY_ID)
  async findOneBy(@Payload('id') id: string) {
    return await this.itemsPpeService.findOneBy(id);
  }
}
