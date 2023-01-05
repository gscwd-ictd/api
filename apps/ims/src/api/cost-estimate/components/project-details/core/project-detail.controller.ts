import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ICrudRoutes } from '@gscwd-api/crud';
import { ProjectDetailService } from './project-detail.service';
import { CreateProjectDetailDto, UpdateProjectDetailDto } from '../data/project-detail.dto';

@Controller({ version: '1', path: 'cost-estimates/project-details' })
export class ProjectDetailController implements ICrudRoutes {
  constructor(private readonly projectDetailService: ProjectDetailService) {}

  @Post()
  async create(@Body() itemDto: CreateProjectDetailDto) {
    return await this.projectDetailService.create(itemDto, () => new BadRequestException());
  }

  @Get()
  async findAll() {
    return await this.projectDetailService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.projectDetailService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDetailDto) {
    return await this.projectDetailService.update({ id }, dto, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.projectDetailService.delete({ id }, () => new BadRequestException());
  }
}
