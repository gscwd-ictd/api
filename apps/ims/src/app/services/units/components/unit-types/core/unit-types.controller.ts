import { CreateUnitTypeDto, UpdateUnitTypeDto } from '@gscwd-api/app-entities';
import { MicroserviceClient, UnitTypesPatterns } from '@gscwd-api/microservices';
import { Body, Controller, Delete, Get, HttpException, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ version: '1', path: 'units/types' })
export class UnitTypesController {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  @Post()
  async create(@Body() data: CreateUnitTypeDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitTypesPatterns.CREATE,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Get()
  async findAll(@Query() { page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitTypesPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitTypesPatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateUnitTypeDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitTypesPatterns.UPDATE,
      payload: { id, data },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitTypesPatterns.DELETE,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
