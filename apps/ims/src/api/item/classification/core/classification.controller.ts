import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { CreateItemClassificationDto, UpdateItemClassificationDto } from '../data/classification.dto';
import { ClassificationService } from './classification.service';

@Controller('item/classification')
export class ClassificationController {
  constructor(private readonly itemService: ClassificationService) {}

  @Post()
  async create(@Body() itemDto: CreateItemClassificationDto) {
    return await this.itemService.create(itemDto, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.itemService.findAll();
  }

  @Get('q')
  async findAllByCharacteristic(@Query('characteristic_id') characteristicId: string) {
    return await this.itemService.findAllBy({ characteristicId });
  }

  @Get(':id')
  async findById(@Param('id') classificationId: string) {
    return await this.itemService.findOneBy({ classificationId }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') classificationId: string, @Body() itemDto: UpdateItemClassificationDto) {
    return await this.itemService.update({ classificationId }, itemDto, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') classificationId: string) {
    return await this.itemService.delete({ classificationId }, () => new BadRequestException());
  }
}
