import { CreateItemSpecificationDto, UpdateItemSpecificationDto } from '@gscwd-api/app-entities';
import { ICrudRoutes } from '@gscwd-api/crud';
import { GeneratorService } from '@gscwd-api/generator';
import { ItemSpecificationsPatterns, MyRpcException } from '@gscwd-api/microservices';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SpecificationsService } from './specifications.service';

@Controller()
export class SpecificationsController implements ICrudRoutes {
  constructor(
    // inject specifications service
    private readonly specificationsService: SpecificationsService,

    // inject generator service
    private readonly generatorService: GeneratorService
  ) {}

  @MessagePattern(ItemSpecificationsPatterns.CREATE)
  async create(@Payload() data: CreateItemSpecificationDto) {
    return await this.specificationsService.crud().create({
      dto: { ...data, code: this.generatorService.generate() as string },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to create item specification',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemSpecificationsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.specificationsService.crud().findAll({
      pagination: { page, limit },
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

  @MessagePattern(ItemSpecificationsPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.specificationsService.crud().findOneBy({
      findBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find item specification',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemSpecificationsPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateItemSpecificationDto) {
    return await this.specificationsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to update item specification.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemSpecificationsPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.specificationsService.crud().delete({
      deleteBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to delete item specification.',
            details: error.message,
          },
        }),
    });
  }
}
