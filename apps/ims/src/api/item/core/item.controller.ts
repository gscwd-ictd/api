import { Controller, Get, Query } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ItemCodesView } from '../data/item-codes.view';
import { ItemDetailsView } from '../data/item-details.view';
import { ItemService } from './item.service';

@Controller({ version: '1', path: 'inquiry/items' })
export class ItemController {
  constructor(private readonly datasource: DataSource, private readonly itemService: ItemService) {}

  @Get('views/code')
  async getAllItemCodes() {
    return await this.datasource.getRepository(ItemCodesView).createQueryBuilder().select().getMany();
  }

  @Get('views/details')
  async getAllItemDetails() {
    return await this.datasource.getRepository(ItemDetailsView).createQueryBuilder().select().getMany();
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
