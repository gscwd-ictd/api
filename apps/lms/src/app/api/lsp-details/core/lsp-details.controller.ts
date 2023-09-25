import { BadRequestException, Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { LspDetailsService } from './lsp-details.service';
import { DeleteResult } from 'typeorm';
import { CreateLspIndividualExternalDto, CreateLspIndividualInternalDto, CreateLspOrganizationExternalDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'lsp-details' })
export class LspDetailsController {
  constructor(private readonly lspDetailsService: LspDetailsService) {}

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

  @Get('/individual')
  async findLspIndividual() {
    return await this.lspDetailsService.findLspIndividual();
  }

  @Post('/individual/internal')
  async createLspIndividualInternal(@Body() data: CreateLspIndividualInternalDto) {
    return await this.lspDetailsService.addLspIndividualInternal(data);
  }

  @Post('/individual/external')
  async createLspIndividualExternal(@Body() data: CreateLspIndividualExternalDto) {
    return await this.lspDetailsService.addLspIndividualExternal(data);
  }

  @Post('/organization/external')
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
