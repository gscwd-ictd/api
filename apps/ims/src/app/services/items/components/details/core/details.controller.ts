import { CreateItemDetailsDto, UpdateItemDetailsDto } from '@gscwd-api/app-entities';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { DetailsService } from './details.service';

@Controller({ version: '1', path: 'items/info/details' })
export class DetailsController {
  constructor(private readonly detailsService: DetailsService) {}

  @Post()
  async create(@Body() data: CreateItemDetailsDto) {
    return await this.detailsService.create(data);
  }

  @Get()
  async findAll(@Query() options: IPaginationOptions) {
    return await this.detailsService.findAll(options);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.detailsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateItemDetailsDto) {
    return await this.detailsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.detailsService.delete(id);
  }
}
