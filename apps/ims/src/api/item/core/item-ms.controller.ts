import { ItemPatterns } from '@gscwd-api/microservices';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { FindItemByIdInterceptor } from '../misc/item.interceptor';
import { FindAllItemsInterceptor } from '../misc/items.interceptor';
import { ItemService } from './item.service';

@Controller()
export class ItemMicroserviceController {
  constructor(private readonly service: ItemService) {}

  @UseInterceptors(FindAllItemsInterceptor)
  @MessagePattern(ItemPatterns.findAll)
  async findAllItems(@Payload() options: IPaginationOptions) {
    return await this.service.findAllItems(options);
  }

  @UseInterceptors(FindItemByIdInterceptor)
  @MessagePattern(ItemPatterns.findById)
  async findItemById(@Payload() id: string) {
    return await this.service.findItemById(id);
  }
}
