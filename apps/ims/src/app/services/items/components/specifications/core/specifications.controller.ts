import { CreateItemSpecificationDto, UpdateItemSpecificationDto } from '@gscwd-api/app-entities';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { SpecificationsService } from './specifications.service';

@Controller({ version: '1', path: 'items/info/specifications' })
export class SpecificationsController {
  constructor(private readonly specificationsService: SpecificationsService) {}

  @Post()
  async create(@Body() data: CreateItemSpecificationDto) {
    return await this.specificationsService.create(data);
  }

  @Get()
  async findAll(@Query() options: IPaginationOptions) {
    return await this.specificationsService.findAll(options);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.specificationsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateItemSpecificationDto) {
    return await this.specificationsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.specificationsService.delete(id);
  }
}
