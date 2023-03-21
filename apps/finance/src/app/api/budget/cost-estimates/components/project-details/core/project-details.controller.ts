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
import { ICrudRoutes } from '@gscwd-api/crud';
import { ProjectDetailsService } from './project-details.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateProjectDetailsDto, ProjectDetails, UpdateProjectDetailsDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'budget/project-details' })
export class ProjectDetailsController implements ICrudRoutes {
  constructor(private readonly projectDetailsService: ProjectDetailsService) {}

  @Post()
  async create(@Body() data: CreateProjectDetailsDto): Promise<ProjectDetails> {
    return await this.projectDetailsService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<ProjectDetails> | ProjectDetails[]> {
    return await this.projectDetailsService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProjectDetails> {
    return await this.projectDetailsService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateProjectDetailsDto): Promise<UpdateResult> {
    return await this.projectDetailsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.projectDetailsService.crud().delete({
      deleteBy: { id },
      onError: () => new BadRequestException(),
    });
  }
}
