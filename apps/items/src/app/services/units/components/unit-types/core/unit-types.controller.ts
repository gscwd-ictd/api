import { CreateUnitTypeDto, UpdateUnitTypeDto } from '@gscwd-api/app-entities';
import { ICrudRoutes } from '@gscwd-api/crud';
import { MyRpcException, UnitTypesPatterns } from '@gscwd-api/microservices';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UnitTypesService } from './unit-types.service';

@Controller()
export class UnitTypesController implements ICrudRoutes {
  constructor(private readonly unitTypesService: UnitTypesService) {}

  @MessagePattern(UnitTypesPatterns.CREATE)
  async create(@Payload() data: CreateUnitTypeDto) {
    return await this.unitTypesService.crud().create({
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to create unit type.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(UnitTypesPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.unitTypesService.crud().findAll({
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

  @MessagePattern(UnitTypesPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.unitTypesService.crud().findOneBy({
      findBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find unit type.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(UnitTypesPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateUnitTypeDto) {
    return await this.unitTypesService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to update unit type.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(UnitTypesPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.unitTypesService.crud().delete({
      deleteBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            details: 'Failed to delete unit type.',
            error: error.message,
          },
        }),
    });
  }
}
