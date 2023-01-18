import { ItemPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class TestService {
  constructor(private readonly client: MicroserviceClient) {}

  async findAllItems(options: IPaginationOptions) {
    return await this.client.send({
      target: ItemPatterns.findAll,
      payload: options,
      onError: () => new BadRequestException(),
    });
  }

  async findItemById(id: string) {
    return await this.client.send({ target: ItemPatterns.findById, payload: id, onError: () => new NotFoundException() });
  }
}
