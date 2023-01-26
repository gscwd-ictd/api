import { CreateItemCategoryDto, UpdateItemCategoryDto } from '@gscwd-api/app-entities';
import { ICrudRoutes } from '@gscwd-api/crud';
import { GeneratorService } from '@gscwd-api/generator';
import { ItemCategoriesPatterns, MyRpcException } from '@gscwd-api/microservices';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';

@Controller()
export class CategoriesController implements ICrudRoutes {
  constructor(
    // inject categories service
    private readonly categoriesService: CategoriesService,

    // inject generator service
    private readonly generatorService: GeneratorService
  ) {}

  @MessagePattern(ItemCategoriesPatterns.CREATE)
  async create(@Payload() data: CreateItemCategoryDto) {
    return await this.categoriesService.crud().create({
      dto: { ...data, code: this.generatorService.generate() as string },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to create item category.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemCategoriesPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.categoriesService.crud().findAll({
      pagination: { page, limit },
      find: { relations: { classification: true }, select: { classification: { id: true, code: true, name: true } } },
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

  @MessagePattern(ItemCategoriesPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.categoriesService.crud().findOneBy({
      findBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find item category.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemCategoriesPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateItemCategoryDto) {
    return await this.categoriesService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to update item category.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemCategoriesPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.categoriesService.crud().delete({
      deleteBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to delete item category.',
            details: error.message,
          },
        }),
    });
  }
}
