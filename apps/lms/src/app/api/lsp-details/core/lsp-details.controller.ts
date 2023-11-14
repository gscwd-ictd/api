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
import { LspDetailsService } from './lsp-details.service';
import {
  CreateLspIndividualExternalDto,
  CreateLspIndividualInternalDto,
  CreateLspOrganizationExternalDto,
  LspDetails,
  UpdateLspIndividualExternalDto,
  UpdateLspIndividualInternalDto,
  UpdateLspOrganizationExternalDto,
} from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LspSource, LspType } from '@gscwd-api/utils';
import { LspInterceptor } from '../misc/interceptors';

@Controller({ version: '1', path: 'lsp-details' })
export class LspDetailsController {
  constructor(private readonly lspDetailsService: LspDetailsService) {}

  // find lsp
  @UseInterceptors(LspInterceptor)
  @Get()
  async findLspIndividual(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('type') lspType: LspType,
    @Query('source') lspSource: LspSource
  ): Promise<Pagination<LspDetails> | LspDetails[]> {
    return await this.lspDetailsService.crud().findAll({
      find: {
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          employeeId: true,
          firstName: true,
          middleName: true,
          lastName: true,
          prefixName: true,
          suffixName: true,
          extensionName: true,
          organizationName: true,
          sex: true,
          email: true,
          lspType: true,
          lspSource: true,
          postalAddress: true,
        },
        where: { lspType, lspSource },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  // insert lsp (type = individual, source = internal)
  @Post('/individual/internal')
  async createLspIndividualInternal(@Body() data: CreateLspIndividualInternalDto) {
    return await this.lspDetailsService.addLspIndividualInternal(data);
  }

  // insert lsp (type = individual, source = external)
  @Post('/individual/external')
  async createLspIndividualExternal(@Body() data: CreateLspIndividualExternalDto) {
    return await this.lspDetailsService.addLspIndividualExternal(data);
  }

  // insert lsp (type = organization, source = external)
  @Post('/organization/external')
  async createLspOrganizationExternal(@Body() data: CreateLspOrganizationExternalDto) {
    return await this.lspDetailsService.addLspOrganizationExternal(data);
  }

  @Put('/individual/internal')
  async updateLspIndividualInternal(@Body() data: UpdateLspIndividualInternalDto) {
    return await this.lspDetailsService.updateLspIndividualInternal(data);
  }

  @Put('/individual/external')
  async updateLspIndividualExternal(@Body() data: UpdateLspIndividualExternalDto) {
    return await this.lspDetailsService.updateLspIndividualExternal(data);
  }

  @Put('/organization/external')
  async updateLspOrganizationExternal(@Body() data: UpdateLspOrganizationExternalDto) {
    return await this.lspDetailsService.updateLspOrganizationExternal(data);
  }

  @Get(':id')
  async findLspById(@Param('id') id: string) {
    return await this.lspDetailsService.getLspById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.lspDetailsService.deleteLspById(id);
  }
}
