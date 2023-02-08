import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  InternalServerErrorException,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { MajorAccountGroupsService } from './major-account-groups.service';
import { CreateMajorAccountGroupDto, UpdateMajorAccountGroupDto } from '../data/major-account-group.dto';
import { ICrudRoutes } from '@gscwd-api/crud';
import { MajorAccountGroup } from '../data/major-account-group.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'chart-of-accounts/major-account-groups' })
export class MajorAccountGroupsController implements ICrudRoutes {
  constructor(private readonly majorAccountGroupsService: MajorAccountGroupsService) {}

  @Post()
  async create(@Body() data: CreateMajorAccountGroupDto): Promise<MajorAccountGroup> {
    return await this.majorAccountGroupsService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<MajorAccountGroup> | MajorAccountGroup[]> {
    return await this.majorAccountGroupsService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<MajorAccountGroup> {
    return await this.majorAccountGroupsService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateMajorAccountGroupDto): Promise<UpdateResult> {
    return await this.majorAccountGroupsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.majorAccountGroupsService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
