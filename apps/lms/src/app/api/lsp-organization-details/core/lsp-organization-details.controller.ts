import { CreateLspOrganizationDetailsDto, LspOrganizationDetails, UpdateLspOrganizationDetailsDto } from '@gscwd-api/models';
import { Body, Controller, DefaultValuePipe, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { LspOrganizationDetailsService } from './lsp-organization-details.service';

@Controller({ version: '1', path: 'lsp-organization-details' })
export class LspOrganizationDetailsController {
  constructor(private readonly lspOrganizationDetailsService: LspOrganizationDetailsService) {}

  //insert lsp organization details
  @Post()
  async create(data: CreateLspOrganizationDetailsDto) {
    return this.lspOrganizationDetailsService.addLspDetails(data);
  }

  //find all learning service provider organization
  //@UseInterceptors(LspDetailsInterceptor)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<LspOrganizationDetails> | LspOrganizationDetails[]> {
    return await this.lspOrganizationDetailsService.crud().findAll({
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

  //   //find learning service provider organization by id
  //   @Get(':id')
  //   async findById(@Param('id') id: string) {
  //     return this.lspOrganizationDetailsService.getLspDetailsById(id);
  //   }

  //   //update learning service provider organization by id
  //   @Put()
  //   async update(@Body() data: UpdateLspOrganizationDetailsDto): Promise<UpdateResult> {
  //     return this.lspOrganizationDetailsService.updateLspDetailsById(data);
  //   }

  //   //delete learning service provider organization by id
  //   @Delete(':id')
  //   async delete(@Param('id') id: string): Promise<DeleteResult> {
  //     return this.lspOrganizationDetailsService.deleteLspDetailsById(id);
  //   }
}
