import { ICrudRoutes } from '@gscwd-api/crud';
import { CreateLspSourceDto, LspSource, UpdateLspSourceDto } from '@gscwd-api/models';
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
import { LspSourcesService } from './lsp-sources.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller({ version: '1', path: 'lsp-sources' })
export class LspSourcesController implements ICrudRoutes {
  constructor(private readonly lspSourcesService: LspSourcesService) {}

  @Post()
  async create(@Body() dto: CreateLspSourceDto): Promise<LspSource> {
    return await this.lspSourcesService.crud().create({
      dto: dto,
      onError: () => new BadRequestException(),
    });
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<LspSource> | LspSource[]> {
    return await this.lspSourcesService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get('q')
  async findIdByName(@Query('source') source: string): Promise<LspSource> {
    const capitalized = source.charAt(0).toUpperCase() + source.slice(1);
    return await this.lspSourcesService.crud().findOneBy({ findBy: { name: capitalized } });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<LspSource> {
    return this.lspSourcesService.crud().findOneBy({
      findBy: { id },
      onError: () => new NotFoundException(),
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateLspSourceDto): Promise<UpdateResult> {
    return this.lspSourcesService.crud().update({
      updateBy: { id },
      dto: data,
      onError: () => new BadRequestException(),
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.lspSourcesService.crud().delete({
      deleteBy: { id },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }
}
