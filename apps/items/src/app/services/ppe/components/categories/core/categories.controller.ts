import { CreatePpeCategoryDto, UpdatePpeCategoryDto } from '@gscwd-api/app-entities';
import { GeneratorService } from '@gscwd-api/generator';
import { MyRpcException, PpeCategoriesPatterns } from '@gscwd-api/microservices';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PpeCategoriesService } from './categories.service';

@Controller()
export class PpeCategoriesController {
  constructor(
    // inject ppe categories service
    private readonly ppeCategoriesService: PpeCategoriesService,

    // inject generator service
    private readonly generatorService: GeneratorService
  ) {}

  @MessagePattern(PpeCategoriesPatterns.CREATE)
  async create(@Payload() data: CreatePpeCategoryDto) {
    return await this.ppeCategoriesService.crud().create({
      dto: { ...data, code: this.generatorService.generate() as string },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to create ppe category.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(PpeCategoriesPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.ppeCategoriesService.crud().findAll({
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

  @MessagePattern(PpeCategoriesPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.ppeCategoriesService.crud().findOneBy({
      findBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find ppe category.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(PpeCategoriesPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdatePpeCategoryDto) {
    return await this.ppeCategoriesService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          message: {
            error: 'Failed to update ppe classification.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(PpeCategoriesPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.ppeCategoriesService.crud().delete({
      deleteBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          message: {
            error: 'Failed to delete ppe classification.',
            details: error.message,
          },
        }),
    });
  }
}
