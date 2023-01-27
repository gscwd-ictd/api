import { CreateItemCategoryDto, UpdateItemCategoryDto } from '@gscwd-api/app-entities';
import { ItemCategoriesPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { HttpException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoriesService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  async create(data: CreateItemCategoryDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCategoriesPatterns.CREATE,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findAll({ page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCategoriesPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findById(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCategoriesPatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async update(id: string, data: UpdateItemCategoryDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCategoriesPatterns.UPDATE,
      payload: { id, data },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async delete(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCategoriesPatterns.DELETE,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
