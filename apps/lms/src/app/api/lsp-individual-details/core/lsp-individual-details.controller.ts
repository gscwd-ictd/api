import { CreateLspIndividualDetailsDto, LspIndividualDetails, UpdateLspIndividualDetailsDto } from '@gscwd-api/models';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LspIndividualDetailsService } from './lsp-individual-details.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { LspDetailsInterceptor } from '../misc/interceptors/lsp-details-interceptor';

@Controller({ version: '1', path: 'lsp-individual-details' })
export class LspIndividualDetailsController {
  constructor(private readonly lspIndividualDetailsService: LspIndividualDetailsService) {}

  //insert learning service provider
  @Post()
  async create(@Body() data: CreateLspIndividualDetailsDto) {
    return await this.lspIndividualDetailsService.addLspDetails(data);
  }

  //find all learning service provider
  @UseInterceptors(LspDetailsInterceptor)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<LspIndividualDetails> | LspIndividualDetails[]> {
    return await this.lspIndividualDetailsService.crud().findAll({
      find: {
        relations: { lspSource: true },
        select: {
          lspSource: {
            name: true,
          },
        },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  //find learning service provider by id
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.lspIndividualDetailsService.getLspDetailsById(id);
  }

  //update learning service provider by id
  @Put()
  async update(@Body() data: UpdateLspIndividualDetailsDto): Promise<UpdateResult> {
    return this.lspIndividualDetailsService.updateLspDetailsById(data);
  }

  //delete learning service provider by id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.lspIndividualDetailsService.deleteLspDetailsById(id);
  }
}
