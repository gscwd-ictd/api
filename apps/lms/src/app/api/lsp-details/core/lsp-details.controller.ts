import { CreateLspDetailsDto, LspDetails, UpdateLspDetailsDto } from '@gscwd-api/models';
import { Body, Controller, DefaultValuePipe, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LspDetailsService } from './lsp-details.service';

@Controller({ version: '1', path: 'lsp-details' })
export class LspDetailsController {
  constructor(private readonly lspDetailsService: LspDetailsService) {}

  @Post()
  async create(@Body() data: CreateLspDetailsDto) {
    return await this.lspDetailsService.addLspDetails(data);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<LspDetails> | LspDetails[]> {
    return await this.lspDetailsService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.lspDetailsService.getLspDetailsById(id);
  }

  @Put()
  async update(@Body() data: UpdateLspDetailsDto) {
    return this.lspDetailsService.updateLspDetailsById(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.lspDetailsService.deleteLspDetailsById(id);
  }
}
