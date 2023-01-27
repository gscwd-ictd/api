import { CreateUnitOfMeasureDto, UpdateUnitOfMeasureDto } from '@gscwd-api/app-entities';
import { MicroserviceClient, UnitsOfMeasurePatterns } from '@gscwd-api/microservices';
import { HttpException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class UnitOfMeasureService {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  async create(data: CreateUnitOfMeasureDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitsOfMeasurePatterns.CREATE,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findAll({ page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitsOfMeasurePatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async findById(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitsOfMeasurePatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async update(id: string, data: UpdateUnitOfMeasureDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitsOfMeasurePatterns.UPDATE,
      payload: { id, data },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  async delete(id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitsOfMeasurePatterns.DELETE,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
