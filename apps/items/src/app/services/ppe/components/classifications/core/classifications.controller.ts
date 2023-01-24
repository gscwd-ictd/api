import { CreatePpeClassificationDto, UpdatePpeClassificationDto } from '@gscwd-api/app-entities';
import { MyRpcException, PpeClassificationsPatterns } from '@gscwd-api/microservices';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PpeClassificationsService } from './classifications.service';

@Controller()
export class PpeClassificationsController {
  constructor(private readonly ppeClassificationService: PpeClassificationsService) {}

  @MessagePattern(PpeClassificationsPatterns.CREATE)
  async create(@Payload() data: CreatePpeClassificationDto) {
    return await this.ppeClassificationService.crud().create({
      dto: { ...data, code: data.code.toUpperCase() },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to create ppe classification.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(PpeClassificationsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.ppeClassificationService.crud().findAll({
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

  @MessagePattern(PpeClassificationsPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.ppeClassificationService.crud().findOneBy({
      findBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find ppe classification.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(PpeClassificationsPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdatePpeClassificationDto) {
    return await this.ppeClassificationService.crud().update({
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

  @MessagePattern(PpeClassificationsPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.ppeClassificationService.crud().delete({
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
