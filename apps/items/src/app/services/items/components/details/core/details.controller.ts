import { CreateItemDetailsDto, UpdateItemDetailsDto } from '@gscwd-api/models';
import { throwRpc } from '@gscwd-api/crud';
import { ItemDetailsPatterns } from '@gscwd-api/microservices';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DetailsService } from './details.service';

@Controller('details')
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @MessagePattern(ItemDetailsPatterns.CREATE)
  async create(data: CreateItemDetailsDto) {
    return await this.detailsService.crud().create({
      dto: data,
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemDetailsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.detailsService.crud().findAll({
      pagination: { page, limit },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemDetailsPatterns.FIND_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.detailsService.crud().findOneBy({
      findBy: { id },
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemDetailsPatterns.UPDATE)
  async update(@Payload('id') id: string, @Payload('data') data: UpdateItemDetailsDto) {
    return await this.detailsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: (error) => throwRpc(error),
    });
  }

  @MessagePattern(ItemDetailsPatterns.DELETE)
  async delete(@Payload('id') id: string) {
    return await this.detailsService.crud().delete({
      deleteBy: { id },
      onError: (error) => throwRpc(error),
    });
  }
}
