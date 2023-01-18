import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { DataSource } from 'typeorm';
import { SpecificationService } from '../components/specification';
import { ItemDetailsView } from '../data/item-details.view';

@Injectable()
export class ItemService {
  constructor(
    // inject specification service
    private readonly specificationService: SpecificationService,

    // inject data source to get repository of a specific view entity
    private readonly datasource: DataSource
  ) {}

  async findAllItems(pagination: IPaginationOptions) {
    return await paginate(this.datasource.getRepository(ItemDetailsView), pagination, {
      select: {
        id: true,
        characteristic_code: true,
        classification_code: true,
        category_code: true,
        category_name: true,
        specification_code: true,
        details: true,
        description: true,
      },
    });
  }

  async findItemById(id: string) {
    return await this.specificationService.crud().findOne(
      {
        where: { id },
        relations: { unit: true, category: { classification: { characteristic: true } } },
        select: {
          unit: { name: true, symbol: true },
          category: { code: true, name: true, classification: { code: true, name: true, characteristic: { code: true, name: true } } },
        },
      },
      () => new NotFoundException()
    );
  }
}
