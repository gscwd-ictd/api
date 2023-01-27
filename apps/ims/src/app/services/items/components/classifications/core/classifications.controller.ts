import { CreateItemClassificationDto, UpdateItemClassificationDto } from '@gscwd-api/app-entities';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ClassificationsService } from './classifications.service';

@Controller({ version: '1', path: 'items/info/classifications' })
export class ClassificationsController {
  constructor(private readonly classificationService: ClassificationsService) {}

  @Post()
  async create(@Body() data: CreateItemClassificationDto) {
    return await this.classificationService.create(data);
  }

  @Get()
  async findAll(@Query() options: IPaginationOptions) {
    return await this.classificationService.findAll(options);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.classificationService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateItemClassificationDto) {
    return await this.classificationService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.classificationService.delete(id);
  }
}
