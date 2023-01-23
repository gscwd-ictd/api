import { CreateUnitOfMeasureDto, UpdateUnitOfMeasureDto } from '@gscwd-api/app-entities';
import { MicroserviceClient, UnitsOfMeasurePatterns } from '@gscwd-api/microservices';
import { Body, Controller, Delete, Get, HttpException, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ version: '1', path: 'units/measurement' })
export class UnitOfMeasureController {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  @Post()
  async create(@Body() data: CreateUnitOfMeasureDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitsOfMeasurePatterns.CREATE,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Get()
  async findAll(@Query() { page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitsOfMeasurePatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitsOfMeasurePatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateUnitOfMeasureDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitsOfMeasurePatterns.UPDATE,
      payload: { id, data },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: UnitsOfMeasurePatterns.DELETE,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
