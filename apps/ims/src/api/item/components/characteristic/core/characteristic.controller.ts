import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ICrudRoutes } from '@gscwd-api/crud';
import { CreateItemCharacteristicsDto, UpdateItemCharacteristicsDto } from '../data/characteristic.dto';
import { CharacteristicService } from './characteristic.service';

@Controller('items/characteristics')
export class CharacteristicController implements ICrudRoutes {
  constructor(private readonly characteristicService: CharacteristicService) {}

  @Post()
  async create(@Body() data: CreateItemCharacteristicsDto) {
    return await this.characteristicService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.characteristicService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.characteristicService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateItemCharacteristicsDto) {
    return await this.characteristicService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.characteristicService.delete({ id }, () => new BadRequestException());
  }
}
