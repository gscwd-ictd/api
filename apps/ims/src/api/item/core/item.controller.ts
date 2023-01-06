import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ItemCodesView } from '../data/item-codes.view';
import { ItemDetailsView } from '../data/item-details.view';
import { FindManyItemViewDetailsInterceptor, FindOneItemViewDetailsInterceptor } from '../misc/item-details.interceptor';
import { ItemService } from './item.service';

@Controller({ version: '1', path: 'inquiry/items' })
export class ItemController {
  constructor(private readonly datasource: DataSource, private readonly itemService: ItemService) {}

  @Get('views/code')
  async getAllItemCodes() {
    return await this.datasource.getRepository(ItemCodesView).createQueryBuilder().select().getMany();
  }

  @UseInterceptors(FindManyItemViewDetailsInterceptor)
  @Get('views/details')
  async getAllItemDetails() {
    return await this.datasource.getRepository(ItemDetailsView).createQueryBuilder().select().getMany();
  }

  @UseInterceptors(FindManyItemViewDetailsInterceptor)
  @Get('views/details/category')
  async getAllItemDetailsByCategoryName(@Query('name') categoryName: string) {
    return await this.datasource.getRepository(ItemDetailsView).find({ where: { category_name: categoryName } });
  }

  @UseInterceptors(FindOneItemViewDetailsInterceptor)
  @Get('views/details/specification')
  async getItemDetailsBySpecificationCode(@Query('code') specificationCode: string) {
    return await this.datasource.getRepository(ItemDetailsView).findOne({ where: { specification_code: specificationCode } });
  }

  @Get('characteristics')
  async findCharacteristicByCode(@Query('code') code: string) {
    return await this.itemService.findCharacteristicByCode(code);
  }

  @Get('classification')
  async findClassificationByCode(@Query('code') code: string) {
    return await this.itemService.findClassificationByCode(code);
  }

  @Get('categories')
  async findCategoryByCode(@Query('code') code: string) {
    return await this.itemService.findCategoryByCode(code);
  }

  @Get('specifications')
  async findSpecificationByCode(@Query('code') code: string) {
    return await this.itemService.findSpecificationByCode(code);
  }
}
