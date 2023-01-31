import { CreateUnitOfMeasureDto, UpdateUnitOfMeasureDto } from '@gscwd-api/models';
import { ICrudRoutes, throwRpc } from '@gscwd-api/crud';
import { UnitsOfMeasurePatterns } from '@gscwd-api/microservices';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UnitOfMeasureService } from './unit-of-measure.service';

@Controller()
export class UnitOfMeasureController implements ICrudRoutes {
  constructor(private readonly unitOfMeasureService: UnitOfMeasureService) {}

  @MessagePattern(UnitsOfMeasurePatterns.CREATE)
  async create(data: CreateUnitOfMeasureDto) {
    return await this.unitOfMeasureService.crud().create({
      dto: data,
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(UnitsOfMeasurePatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.unitOfMeasureService.crud().findAll({
      pagination: { page, limit },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(UnitsOfMeasurePatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.unitOfMeasureService.crud().findOneBy({
      findBy: { id },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(UnitsOfMeasurePatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateUnitOfMeasureDto) {
    return await this.unitOfMeasureService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(UnitsOfMeasurePatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.unitOfMeasureService.crud().delete({
      deleteBy: { id },
      onError: (error) => throwRpc(error),
    });
  }
}
