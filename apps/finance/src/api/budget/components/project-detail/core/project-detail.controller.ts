import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ICrudRoutes } from '@gscwd-api/crud';
import { ProjectDetailService } from './project-detail.service';
import { CreateProjectDetailDto, UpdateProjectDetailDto } from '../data/project-detail.dto';
import { ProjectDetail } from '../data/project-detail.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'cost-estimates/project-details' })
export class ProjectDetailController implements ICrudRoutes {
  constructor(private readonly projectDetailService: ProjectDetailService) {}

  @Post()
  async create(@Body() data: CreateProjectDetailDto): Promise<ProjectDetail> {
    return await this.projectDetailService.crud().create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ProjectDetail> | ProjectDetail[]> {
    return await this.projectDetailService.crud().findAll({ pagination: { page, limit } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProjectDetail> {
    return await this.projectDetailService.crud().findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateProjectDetailDto): Promise<UpdateResult> {
    return await this.projectDetailService.crud().update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.projectDetailService.crud().delete({ id }, () => new BadRequestException());
  }
}
