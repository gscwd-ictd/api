import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
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
  UploadPhotoDto,
} from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LspSource, LspType } from '@gscwd-api/utils';
import { FindAllLspInterceptor } from '../misc/interceptors';

@Controller({ version: '1', path: 'lsp' })
export class LspDetailsController {
  constructor(private readonly lspDetailsService: LspDetailsService) {}

  /* find all learning service provider */
  @UseInterceptors(FindAllLspInterceptor)
  @Get('q')
  async findAllLsp(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('type') type: LspType,
    @Query('source') source: LspSource
  ): Promise<Pagination<LspDetails> | Array<LspDetails>> {
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
          type: true,
          source: true,
          postalAddress: true,
        },
        where: { type, source },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* find learning service provider by id */
  @Get(':id')
  async findLspDetailsById(@Param('id') id: string) {
    return await this.lspDetailsService.findLspDetailsById(id);
  }

  /* insert learning service provider (type = individual & source = internal) */
  @Post('/individual/internal')
  async createLspIndividualInternal(@Body() data: CreateLspIndividualInternalDto) {
    return await this.lspDetailsService.createLspIndividualInternal(data);
  }

  /* insert learning service provider (type = individual & source = external) */
  @Post('/individual/external')
  async createLspIndividualExternal(@Body() data: CreateLspIndividualExternalDto) {
    return await this.lspDetailsService.createLspIndividualExternal(data);
  }

  /* insert learning service provider (type = organization & source = external) */
  @Post('/organization/external')
  async createLspOrganizationExternal(@Body() data: CreateLspOrganizationExternalDto) {
    return await this.lspDetailsService.createLspOrganizationExternal(data);
  }

  /* edit learning service provider by id (type = individual & source = internal) */
  @Put('/individual/internal')
  async updateLspIndividualInternal(@Body() data: UpdateLspIndividualInternalDto) {
    return await this.lspDetailsService.updateLspIndividualInternal(data);
  }

  /* edit learning service provider by id (type = individual & source = external) */
  @Put('/individual/external')
  async updateLspIndividualExternal(@Body() data: UpdateLspIndividualExternalDto) {
    return await this.lspDetailsService.updateLspIndividualExternal(data);
  }

  /* edit learning service provider by id (type = organization & source = external) */
  @Put('/organization/external')
  async updateLspOrganizationExternal(@Body() data: UpdateLspOrganizationExternalDto) {
    return await this.lspDetailsService.updateLspOrganizationExternal(data);
  }

  /* remove learning service provider by id */
  @Delete(':id')
  async deleteLspById(@Param('id') id: string) {
    return await this.lspDetailsService.crud().delete({
      deleteBy: { id },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }

  /* upload the photo of learning service provider */
  @Patch('upload/photo')
  async uploadPhoto(@Body() data: UploadPhotoDto) {
    return await this.lspDetailsService.uploadPhoto(data);
  }
}
