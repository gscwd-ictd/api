import { CreateItemClassificationDto, UpdateItemClassificationDto } from '@gscwd-api/app-entities';
import { ICrudRoutes, throwRpc } from '@gscwd-api/crud';
import { ItemClassificationsPatterns } from '@gscwd-api/microservices';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClassificationsService } from './classifications.service';

@Controller()
export class ClassificationsController implements ICrudRoutes {
  constructor(private readonly classificationsService: ClassificationsService) {}

  @MessagePattern(ItemClassificationsPatterns.CREATE)
  async create(@Payload() data: CreateItemClassificationDto) {
    return await this.classificationsService.crud().create({
      dto: { ...data, code: data.code.toUpperCase() },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemClassificationsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.classificationsService.crud().findAll({
      pagination: { page, limit },
      find: { relations: { characteristic: true }, select: { characteristic: { id: true, code: true, name: true } } },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemClassificationsPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.classificationsService.crud().findOneBy({
      findBy: { id },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemClassificationsPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateItemClassificationDto) {
    return await this.classificationsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemClassificationsPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.classificationsService.crud().delete({
      deleteBy: { id },
      onError: (error) => throwRpc(error),
    });
  }
}
