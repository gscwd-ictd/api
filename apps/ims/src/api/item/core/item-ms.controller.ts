import { ItemPatterns, MyRpcException } from '@gscwd-api/microservices';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { DataSource } from 'typeorm';
import { SpecificationService } from '../components/specification';
import { ItemDetailsView } from '../data/item-details.view';
import { FindItemByIdInterceptor } from '../misc/item.interceptor';
import { FindAllItemsInterceptor } from '../misc/items.interceptor';

@Controller()
export class ItemMicroserviceController {
  constructor(
    // inject specification service
    private readonly specificationService: SpecificationService,

    // inject data source to get repository of a specific view entity
    private readonly datasource: DataSource
  ) {}

  @UseInterceptors(FindAllItemsInterceptor)
  @MessagePattern(ItemPatterns.FIND_ALL)
  async findAllItems(@Payload() pagination: IPaginationOptions) {
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

  @UseInterceptors(FindItemByIdInterceptor)
  @MessagePattern(ItemPatterns.FIND_BY_ID)
  async findItemById(@Payload() id: string) {
    return await this.specificationService.crud().findOne({
      onError: (error) => new MyRpcException({ code: 404, message: 'Not found', details: error.message }),
      find: {
        where: { id },
        relations: { unit: true, category: { classification: { characteristic: true } } },
        select: {
          unit: { name: true, symbol: true },
          category: { code: true, name: true, classification: { code: true, name: true, characteristic: { code: true, name: true } } },
        },
      },
    });
  }
}
