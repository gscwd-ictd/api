import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ItemCodesView } from '../data/item-codes.view';
import { ItemDetailsView } from '../data/item-details.view';

@Controller({ version: '1', path: 'inquiry/items' })
export class ItemController {
  constructor(private readonly datasource: DataSource) {}

  @Get('views/code')
  async getAllItemCodes() {
    return await this.datasource.getRepository(ItemCodesView).createQueryBuilder().select().getMany();
  }

  @Get('views/details')
  async getAllItemDetails() {
    return await this.datasource.getRepository(ItemDetailsView).createQueryBuilder().select().getMany();
  }
}
