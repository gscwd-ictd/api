import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DataSource } from 'typeorm';
import { ItemCodesView } from '../data/item-codes.view';
import { ItemDetailsView } from '../data/item-details.view';
import { FindManyItemViewDetailsInterceptor } from '../misc/item-details.interceptor';
import { ItemService } from './item.service';

@Controller({ version: '1', path: 'items' })
export class ItemController {
  constructor(private readonly datasource: DataSource, private readonly itemService: ItemService) {}

  @Get('views/code')
  async getAllItemCodes(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ItemCodesView>> {
    return await paginate(this.datasource.getRepository(ItemCodesView), { page, limit });
  }

  @UseInterceptors(FindManyItemViewDetailsInterceptor)
  @Get('views/details')
  async getAllItemDetails(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ItemDetailsView>> {
    return await paginate(this.datasource.getRepository(ItemDetailsView), { page, limit });
  }

  @UseInterceptors(FindManyItemViewDetailsInterceptor)
  @Get('views/details/category')
  async getAllItemDetailsByCategoryName(
    @Query('name') categoryName: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ItemDetailsView>> {
    return await paginate(this.datasource.getRepository(ItemDetailsView), { page, limit }, { where: { category_name: categoryName } });
  }

  @Get('characteristics/q')
  async findItemsByCharacteristicCode(@Query('code') code: string) {
    return await this.itemService.findCharacteristicByCode(code);
  }

  @Get('classification/q')
  async findItemsByClassificationCode(@Query('code') code: string) {
    return await this.itemService.findClassificationByCode(code);
  }

  @Get('categories/q')
  async findItemsByCategoryCode(@Query('code') code: string) {
    return await this.itemService.findCategoryByCode(code);
  }

  @Get('specifications/q')
  async findItemBySpecificationCode(@Query('code') code: string) {
    return await this.itemService.findSpecificationByCode(code);
  }
}
