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
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VenueDetailsService } from './venue-details.service';
import { CreateVenueDetailsDto, UpdateVenueDetailsDto, VenueDetails } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'venue-details' })
export class VenueDetailsController implements ICrudRoutes {
  constructor(private readonly venueDetailsService: VenueDetailsService) {}

  @Post()
  async create(@Body() data: CreateVenueDetailsDto): Promise<VenueDetails> {
    return await this.venueDetailsService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<VenueDetails> | VenueDetails[]> {
    return await this.venueDetailsService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<VenueDetails> {
    return this.venueDetailsService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateVenueDetailsDto): Promise<UpdateResult> {
    return this.venueDetailsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.venueDetailsService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
