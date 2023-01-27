import { CreateItemSpecificationDto, UpdateItemSpecificationDto } from '@gscwd-api/app-entities';
import { ICrudRoutes, throwRpc } from '@gscwd-api/crud';
import { ItemSpecificationsPatterns } from '@gscwd-api/microservices';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SpecificationsService } from './specifications.service';

@Controller()
export class SpecificationsController implements ICrudRoutes {
  constructor(
    // inject specifications service
    private readonly specificationsService: SpecificationsService
  ) {}

  @MessagePattern(ItemSpecificationsPatterns.CREATE)
  async create(@Payload() data: CreateItemSpecificationDto) {
    return await this.specificationsService.transactionalInsert(data);
  }

  @MessagePattern(ItemSpecificationsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.specificationsService.crud().findAll({
      pagination: { page, limit },
      find: { relations: { category: true }, select: { category: { id: true, code: true, name: true } } },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemSpecificationsPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.specificationsService.crud().findOneBy({
      findBy: { id },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemSpecificationsPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateItemSpecificationDto) {
    return await this.specificationsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemSpecificationsPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.specificationsService.crud().delete({
      deleteBy: { id },
      onError: (error) => throwRpc(error),
    });
  }
}
