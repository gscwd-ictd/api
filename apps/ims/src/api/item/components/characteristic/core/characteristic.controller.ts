import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ICrudRoutes } from '@gscwd-api/crud';
import { CreateItemCharacteristicsDto, UpdateItemCharacteristicsDto } from '../data/characteristic.dto';
import { CharacteristicService } from './characteristic.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ItemCharacteristic } from '../data/characteristic.entity';

@Controller({ version: '1', path: 'items/characteristics' })
export class CharacteristicController implements ICrudRoutes {
  constructor(private readonly service: CharacteristicService) {}

  @Post()
  async create(@Body() data: CreateItemCharacteristicsDto) {
    return await this.service.getProvider().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ItemCharacteristic>> {
    return await this.service.getProvider().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.service.getProvider().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateItemCharacteristicsDto) {
    return await this.service.getProvider().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.getProvider().delete({ id }, () => new BadRequestException());
  }
}
