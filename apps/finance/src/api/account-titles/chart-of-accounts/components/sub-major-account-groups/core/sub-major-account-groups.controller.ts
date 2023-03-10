import { ICrudRoutes } from '@gscwd-api/crud';
import { CreateSubMajorAccountGroupDto, SubMajorAccountGroup, UpdateSubMajorAccountGroupDto } from '@gscwd-api/models';
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
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SubMajorAccountGroupService } from './sub-major-account-groups.service';

@Controller({ version: '1', path: 'chart-of-accounts/sub-major-account-groups' })
export class SubMajorAccountGroupController implements ICrudRoutes {
  constructor(private readonly subMajorAccountGroupsService: SubMajorAccountGroupService) {}

  @Post()
  async create(@Body() data: CreateSubMajorAccountGroupDto): Promise<SubMajorAccountGroup> {
    return await this.subMajorAccountGroupsService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<SubMajorAccountGroup> | SubMajorAccountGroup[]> {
    return await this.subMajorAccountGroupsService.crud().findAll({
      pagination: { page, limit },
      find: { relations: { majorAccountGroup: true }, select: { majorAccountGroup: { id: true, code: true, name: true } } },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<SubMajorAccountGroup> {
    return await this.subMajorAccountGroupsService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateSubMajorAccountGroupDto): Promise<UpdateResult> {
    return await this.subMajorAccountGroupsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.subMajorAccountGroupsService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
