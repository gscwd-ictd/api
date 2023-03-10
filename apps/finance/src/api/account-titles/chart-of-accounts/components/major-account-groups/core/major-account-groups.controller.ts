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
import { MajorAccountGroupService } from './major-account-groups.service';
import { ICrudRoutes } from '@gscwd-api/crud';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateMajorAccountGroupDto, MajorAccountGroup, UpdateMajorAccountGroupDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'chart-of-accounts/major-account-groups' })
export class MajorAccountGroupController implements ICrudRoutes {
  constructor(private readonly majorAccountGroupService: MajorAccountGroupService) {}

  @Post()
  async create(@Body() data: CreateMajorAccountGroupDto): Promise<MajorAccountGroup> {
    return await this.majorAccountGroupService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<MajorAccountGroup> | MajorAccountGroup[]> {
    return await this.majorAccountGroupService.crud().findAll({
      pagination: { page, limit },
      find: { relations: { accountGroup: true }, select: { accountGroup: { id: true, code: true, name: true } } },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<MajorAccountGroup> {
    return await this.majorAccountGroupService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateMajorAccountGroupDto): Promise<UpdateResult> {
    return await this.majorAccountGroupService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.majorAccountGroupService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
