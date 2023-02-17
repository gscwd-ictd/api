import { ItemsViewPatterns } from '@gscwd-api/microservices';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  FindAllItemSummariesInterceptor,
  FindItemInfoByIdInterceptor,
  FindItemSummaryInterceptor,
  GetItemBalanceInterceptor,
} from '../../../../global/';
import { ItemsService } from './items.service';

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @UseInterceptors(FindAllItemSummariesInterceptor)
  @MessagePattern(ItemsViewPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.itemsService.findAll(page, limit);
  }

  @UseInterceptors(FindItemInfoByIdInterceptor)
  @MessagePattern(ItemsViewPatterns.FIND_BY_ID)
  async findOneBy(@Payload('id') id: string) {
    return await this.itemsService.findOneBy(id);
  }

  @UseInterceptors(FindItemSummaryInterceptor)
  @MessagePattern(ItemsViewPatterns.FIND_SUMMARY_BY_ID)
  async findOneSummaryBy(@Payload('id') id: string) {
    return await this.itemsService.findOneBy(id);
  }

  @UseInterceptors(GetItemBalanceInterceptor)
  @MessagePattern(ItemsViewPatterns.GET_ITEM_BALANCE)
  async getBalanceById(@Payload('id') id: string) {
    return await this.itemsService.getItemBalance(id);
  }
}
