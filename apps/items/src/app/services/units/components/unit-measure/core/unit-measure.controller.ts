import { CreateUnitOfMeasureDto, UpdateUnitOfMeasureDto } from '@gscwd-api/app-entities';
import { ICrudRoutes } from '@gscwd-api/crud';
import { MyRpcException, UnitsOfMeasurePatterns } from '@gscwd-api/microservices';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UnitOfMeasureService } from './unit-measure.service';

@Controller()
export class UnitOfMeasureController implements ICrudRoutes {
  constructor(private readonly unitOfMeasureService: UnitOfMeasureService) {}

  @MessagePattern(UnitsOfMeasurePatterns.CREATE)
  async create(@Payload() data: CreateUnitOfMeasureDto) {
    return await this.unitOfMeasureService.crud().create({
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to create unit of measure.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(UnitsOfMeasurePatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.unitOfMeasureService.crud().findAll({
      pagination: { page, limit },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Something went wrong.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(UnitsOfMeasurePatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.unitOfMeasureService.crud().findOneBy({
      findBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find unit of measure.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(UnitsOfMeasurePatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateUnitOfMeasureDto) {
    return await this.unitOfMeasureService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to update unit of measure.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(UnitsOfMeasurePatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.unitOfMeasureService.crud().delete({
      deleteBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            details: 'Failed to delete unit of measure.',
            error: error.message,
          },
        }),
    });
  }
}
