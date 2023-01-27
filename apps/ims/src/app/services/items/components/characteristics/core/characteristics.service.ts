import { CreateItemCharacteristicDto, UpdateItemCharacteristicDto } from '@gscwd-api/app-entities';
import { ItemCharacteristicsPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { HttpException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class CharacteristicsService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  async create(data: CreateItemCharacteristicDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCharacteristicsPatterns.CREATE,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findAll({ page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCharacteristicsPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findById(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCharacteristicsPatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async update(id: string, data: UpdateItemCharacteristicDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCharacteristicsPatterns.UPDATE,
      payload: { id, data },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async delete(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCharacteristicsPatterns.DELETE,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
