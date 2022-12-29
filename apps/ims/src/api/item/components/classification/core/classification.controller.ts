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
  async findAll(@Query('relations') loadRelations?: boolean) {
    if (!loadRelations) return await this.itemService.findAll();

    return await this.itemService.findAll({ select: { characteristic: { name: true, code: true } }, relations: { characteristic: true } });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Query('relations') loadRelations?: boolean) {
    if (!loadRelations) return await this.itemService.findOneBy({ id }, () => new NotFoundException());

    return await this.itemService.findOne(
      {
        where: { id },
        relations: { characteristic: true },
        select: { characteristic: { name: true, code: true } },
      },
      () => new NotFoundException()
    );
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() itemDto: UpdateItemClassificationDto) {
    return await this.itemService.update({ id }, itemDto, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.itemService.delete({ id }, () => new BadRequestException());
  }
}
