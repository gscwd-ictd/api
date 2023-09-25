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
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { LspDetailsService } from './lsp-details.service';
import { DeleteResult } from 'typeorm';
import { LspType } from '@gscwd-api/utils';
import { CreateLspIndividualExternalDto, CreateLspIndividualInternalDto, CreateLspOrganizationExternalDto } from '@gscwd-api/models';
import { FindLspIndividualInterceptor, FindLspOrganizationInterceptor } from '../misc/interceptors';

@Controller({ version: '1', path: 'lsp-details' })
export class LspDetailsController {
  constructor(private readonly lspDetailsService: LspDetailsService) {}

  @Get('/individual')
  async findAllLspIndividual() {
    return await this.lspDetailsService.findLspIndividual();
  }

  // @UseInterceptors(FindLspIndividualInterceptor)
  // @Get('/individual')
  // async findAllLspIndividual(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  // ) {
  //   return await this.lspDetailsService.crud().findAll({
  //     find: {
  //       select: {
  //         id: true,
  //         employeeId: true,
  //         firstName: true,
  //         middleName: true,
  //         lastName: true,
  //         prefixName: true,
  //         suffixName: true,
  //         extensionName: true,
  //         email: true,
  //         lspSource: true,
  //         postalAddress: true,
  //       },
  //       where: {
  //         lspType: LspType.INDIVIDUAL,
  //       },
  //     },
  //     pagination: { page, limit },
  //     onError: () => new InternalServerErrorException(),
  //   });
  // }

  // @UseInterceptors(FindLspOrganizationInterceptor)
  // @Get('/organization')
  // async findAllLspOrganization(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  // ) {
  //   return await this.lspDetailsService.crud().findAll({
  //     find: {
  //       select: {
  //         id: true,
  //         organizationName: true,
  //         email: true,
  //         lspSource: true,
  //         postalAddress: true,
  //       },
  //       where: {
  //         lspType: LspType.ORGANIZATION,
  //       },
  //     },
  //     pagination: { page, limit },
  //     onError: () => new InternalServerErrorException(),
  //   });
  // }

  @Post('individual/internal')
  async createLspIndividualInternal(@Body() data: CreateLspIndividualInternalDto) {
    return await this.lspDetailsService.addLspIndividualInternal(data);
  }

  @Post('individual/external')
  async createLspIndividualExternal(@Body() data: CreateLspIndividualExternalDto) {
    return await this.lspDetailsService.addLspIndividualExternal(data);
  }

  @Post('organization/external')
  async createLspOrganizationExternal(@Body() data: CreateLspOrganizationExternalDto) {
    return await this.lspDetailsService.addLspOrganizationExternal(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.lspDetailsService.crud().delete({
      deleteBy: { id },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }
}
