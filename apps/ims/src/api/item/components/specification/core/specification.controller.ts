import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateItemSpecificationDto, UpdateItemSpecificationDto } from '../data/specification.dto';
import { SpecificationService } from './specification.service';

@Controller('item/specifications')
export class SpecificationController {
  constructor(private readonly itemService: SpecificationService) {}

  @Post()
  async create(@Body() itemDto: CreateItemSpecificationDto) {
    return await this.itemService.create(itemDto, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.itemService.findAll();
  }

  @Get('q')
  async findAllByCategory(@Query('category_id') categoryId: string) {
    return await this.itemService.findAllBy({ categoryId });
  }

  @Get(':id')
  async findById(@Param('id') specificationId: string) {
    return await this.itemService.findOneBy({ specificationId });
  }

  @Put(':id')
  async update(@Param('id') specificationId: string, itemDto: UpdateItemSpecificationDto) {
    return await this.itemService.update({ specificationId }, itemDto, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') specificationId: string) {
    return await this.itemService.delete({ specificationId });
  }
}
