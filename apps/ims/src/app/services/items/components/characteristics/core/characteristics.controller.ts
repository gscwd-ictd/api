import { CreateItemCharacteristicDto, UpdateItemCharacteristicDto } from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CharacteristicsService } from './characteristics.service';

@Controller({ version: '1', path: 'items/info/characteristics' })
export class CharacteristicsController {
  constructor(private readonly characteristicsService: CharacteristicsService) {}

  @Post()
  async create(@Body() data: CreateItemCharacteristicDto) {
    return await this.characteristicsService.create(data);
  }

  @Get()
  async findAll(@Query() options: IPaginationOptions) {
    return await this.characteristicsService.findAll(options);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.characteristicsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateItemCharacteristicDto) {
    return await this.characteristicsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.characteristicsService.delete(id);
  }
}
