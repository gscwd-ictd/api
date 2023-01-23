import { ItemCharacteristicsPatterns, MyRpcException } from '@gscwd-api/microservices';
import { CreateItemCharacteristicDto, UpdateItemCharacteristicDto } from '@gscwd-api/app-entities';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CharacteristicsService } from './characteristics.service';
import { ICrudRoutes } from '@gscwd-api/crud';

@Controller()
export class CharacteristicsController implements ICrudRoutes {
  constructor(private readonly characteristicsService: CharacteristicsService) {}

  @MessagePattern(ItemCharacteristicsPatterns.CREATE)
  async create(@Payload() data: CreateItemCharacteristicDto) {
    return await this.characteristicsService.crud().create({
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to create item characteristic.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemCharacteristicsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.characteristicsService.crud().findAll({
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

  @MessagePattern(ItemCharacteristicsPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.characteristicsService.crud().findOneBy({
      findBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find item characteristic.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemCharacteristicsPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateItemCharacteristicDto) {
    return await this.characteristicsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to update item characteristic.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemCharacteristicsPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.characteristicsService.crud().delete({
      deleteBy: { id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.BAD_REQUEST,
          details: error,
          message: {
            error: 'Failed to delete item characteristic.',
            details: error.message,
          },
        }),
    });
  }
}
