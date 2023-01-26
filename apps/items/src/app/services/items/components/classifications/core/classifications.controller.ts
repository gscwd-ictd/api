import { CreateItemClassificationDto, UpdateItemClassificationDto } from '@gscwd-api/app-entities';
import { ICrudRoutes } from '@gscwd-api/crud';
import { ItemClassificationsPatterns, MyRpcException } from '@gscwd-api/microservices';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClassificationsService } from './classifications.service';

@Controller()
export class ClassificationsController implements ICrudRoutes {
  constructor(private readonly classificationsService: ClassificationsService) {}

  @MessagePattern(ItemClassificationsPatterns.CREATE)
  async create(@Payload() data: CreateItemClassificationDto) {
    return await this.classificationsService.crud().create({
      dto: { ...data, code: data.code.toUpperCase() },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to create item classification.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemClassificationsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.classificationsService.crud().findAll({
      pagination: { page, limit },
      find: { relations: { characteristic: true }, select: { characteristic: { id: true, code: true, name: true } } },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          details: error,
          message: {
            error: 'Something went wrong.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemClassificationsPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.classificationsService.crud().findOneBy({
      findBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find item classification.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemClassificationsPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateItemClassificationDto) {
    return await this.classificationsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          message: {
            error: 'Failed to update item classification.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemClassificationsPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.classificationsService.crud().delete({
      deleteBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          message: {
            error: 'Failed to delete item classification.',
            details: error.message,
          },
        }),
    });
  }
}
