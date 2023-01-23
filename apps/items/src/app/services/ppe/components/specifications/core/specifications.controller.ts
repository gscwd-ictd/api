import { CreatePpeSpecificationDto, UpdatePpeSpecificationDto } from '@gscwd-api/app-entities';
import { ICrudRoutes } from '@gscwd-api/crud';
import { GeneratorService } from '@gscwd-api/generator';
import { MyRpcException, PpeSpecificationsPatterns } from '@gscwd-api/microservices';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PpeSpecificationsService } from './specifications.service';

@Controller()
export class PpeSpecificationsController implements ICrudRoutes {
  constructor(
    // inject specifications service
    private readonly ppeSpecificationsService: PpeSpecificationsService,

    // inject generator service
    private readonly generatorService: GeneratorService
  ) {}

  @MessagePattern(PpeSpecificationsPatterns.CREATE)
  async create(@Payload() data: CreatePpeSpecificationDto) {
    return await this.ppeSpecificationsService.crud().create({
      dto: { ...data, code: this.generatorService.generate() as string },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to create ppe specification.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(PpeSpecificationsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.ppeSpecificationsService.crud().findAll({
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

  @MessagePattern(PpeSpecificationsPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.ppeSpecificationsService.crud().findOneBy({
      findBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find ppe specification.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(PpeSpecificationsPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdatePpeSpecificationDto) {
    return await this.ppeSpecificationsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to update ppe specification.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(PpeSpecificationsPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.ppeSpecificationsService.crud().delete({
      deleteBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to delete ppe specification.',
            details: error.message,
          },
        }),
    });
  }
}
