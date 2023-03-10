import { CreateItemSpecificationDto, UpdateItemSpecificationDto } from '@gscwd-api/models';
import { ItemSpecificationsPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { HttpException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class SpecificationsService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  async create(data: CreateItemSpecificationDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemSpecificationsPatterns.CREATE,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findAll({ page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemSpecificationsPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findById(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemSpecificationsPatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async update(id: string, data: UpdateItemSpecificationDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemSpecificationsPatterns.UPDATE,
      payload: { id, data },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async delete(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemSpecificationsPatterns.DELETE,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
