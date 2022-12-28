import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreateItemCharacteristicsDto, UpdateItemCharacteristicsDto } from '../data/characteristic.dto';
import { CharacteristicService } from './characteristic.service';

@Controller('item/characteristics')
export class CharacteristicController {
  constructor(private readonly itemService: CharacteristicService) {}

  @Post()
  async create(@Body() itemDto: CreateItemCharacteristicsDto) {
    return await this.itemService.create(itemDto, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.itemService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') characteristicId: string) {
    return await this.itemService.findOneBy({ characteristicId }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') characteristicId: string, @Body() itemDto: UpdateItemCharacteristicsDto) {
    return await this.itemService.update({ characteristicId }, itemDto, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') characteristicId: string) {
    return await this.itemService.delete({ characteristicId }, () => new BadRequestException());
  }
}
