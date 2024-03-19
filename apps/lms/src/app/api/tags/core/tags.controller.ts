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
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult, ILike } from 'typeorm';
import { TagsService } from './tags.service';
import { CreateTagDto, Tag, UpdateTagDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'tags' })
export class TagsController implements ICrudRoutes {
  constructor(private readonly tagsService: TagsService) {}

  /* insert tag */
  @Post()
  async create(@Body() data: CreateTagDto): Promise<Tag> {
    return await this.tagsService.crud().create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  /* find all tags */
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<Tag> | Tag[]> {
    return await this.tagsService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* find tag by id */
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  /* find tag by name */
  @Get('search/q')
  async searchTagName(@Query('name') name: string) {
    return await this.tagsService.getRepository().find({ where: { name: ILike(`%${name}%`) }, select: { id: true, name: true } });
  }

  /* edit tag by id */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTagDto): Promise<UpdateResult> {
    return this.tagsService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  /* remove tag by id */
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.tagsService.deleteTags(id);
  }
}
