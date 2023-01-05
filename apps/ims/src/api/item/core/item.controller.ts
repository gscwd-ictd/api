import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ItemCodeView } from '../data/item-code.view';
import { ItemDetailsView } from '../data/item-details.view';

@Controller({ version: '1', path: 'views/items' })
export class ItemController {
  constructor(private readonly datasource: DataSource) {}

  @Get('code')
  async getAllItemCodes() {
    return await this.datasource.getRepository(ItemCodeView).createQueryBuilder().select().getMany();
  }

  @Get('details')
  async getAllItemDetails() {
    return await this.datasource.getRepository(ItemDetailsView).createQueryBuilder().select().getMany();
  }
}
