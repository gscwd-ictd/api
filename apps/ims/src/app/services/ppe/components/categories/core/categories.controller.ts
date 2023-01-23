import { CreatePpeCategoryDto, UpdatePpeCategoryDto } from '@gscwd-api/app-entities';
import { MicroserviceClient, PpeCategoriesPatterns } from '@gscwd-api/microservices';
import { Body, Controller, Delete, Get, HttpException, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ version: '1', path: 'ppe/info/categories' })
export class PpeCategoriesController {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  @Post()
  async create(@Body() data: CreatePpeCategoryDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: PpeCategoriesPatterns.CREATE,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Get()
  async findAll(@Query() { page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: PpeCategoriesPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: PpeCategoriesPatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdatePpeCategoryDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: PpeCategoriesPatterns.UPDATE,
      payload: { id, data },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: PpeCategoriesPatterns.DELETE,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
