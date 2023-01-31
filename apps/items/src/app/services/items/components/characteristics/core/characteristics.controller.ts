import { ItemCharacteristicsPatterns } from '@gscwd-api/microservices';
import { CreateItemCharacteristicDto, UpdateItemCharacteristicDto } from '@gscwd-api/models';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CharacteristicsService } from './characteristics.service';
import { throwRpc } from '@gscwd-api/crud';

@Controller()
export class CharacteristicsController {
  constructor(private readonly characteristicsService: CharacteristicsService) {}

  @MessagePattern(ItemCharacteristicsPatterns.CREATE)
  async create(@Payload() data: CreateItemCharacteristicDto) {
    return await this.characteristicsService.crud().create({
      dto: data,
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemCharacteristicsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.characteristicsService.crud().findAll({
      pagination: { page, limit },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemCharacteristicsPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.characteristicsService.crud().findOneBy({
      findBy: { id },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemCharacteristicsPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateItemCharacteristicDto) {
    return await this.characteristicsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemCharacteristicsPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.characteristicsService.crud().delete({
      deleteBy: { id },
      onError: (error) => throwRpc(error),
    });
  }
}
