import { ICrudRoutes } from '@gscwd-api/crud';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { VenueFacilitiesService } from './venue-facilities.service';
import { CreateVenueFacilityDto, UpdateVenueFacilityDto, VenueFacility } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'venue-facilities' })
export class VenueFacilitiesController implements ICrudRoutes {
  constructor(private readonly venueFacilitiesService: VenueFacilitiesService) {}

  @Post()
  async create(@Body() data: CreateVenueFacilityDto): Promise<VenueFacility> {
    return await this.venueFacilitiesService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<VenueFacility> | VenueFacility[]> {
    return await this.venueFacilitiesService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<VenueFacility> {
    return this.venueFacilitiesService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateVenueFacilityDto): Promise<UpdateResult> {
    return this.venueFacilitiesService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.venueFacilitiesService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
