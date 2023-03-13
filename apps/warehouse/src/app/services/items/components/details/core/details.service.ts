import { CreateItemDetailsDto, UpdateItemDetailsDto } from '@gscwd-api/models';
import { ItemDetailsPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { HttpException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class DetailsService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  async create(data: CreateItemDetailsDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemDetailsPatterns.CREATE,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findAll({ page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemDetailsPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findById(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemDetailsPatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async update(id: string, data: UpdateItemDetailsDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemDetailsPatterns.UPDATE,
      payload: { id, data },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async delete(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemDetailsPatterns.DELETE,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
