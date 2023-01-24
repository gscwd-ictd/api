import { CreateItemCharacteristicDto, UpdateItemCharacteristicDto } from '@gscwd-api/app-entities';
import { ItemCharacteristicsPatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { Body, Controller, Delete, Get, HttpException, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller({ version: '1', path: 'items/info/characteristics' })
export class CharacteristicsController {
  constructor(private readonly microserviceClient: MicroserviceClient) {}

  @Post()
  async create(@Body() data: CreateItemCharacteristicDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCharacteristicsPatterns.CREATE,
      payload: data,
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Get()
  async findAll(@Query() { page, limit }: IPaginationOptions) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCharacteristicsPatterns.FIND_ALL,
      payload: { page, limit },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCharacteristicsPatterns.FIND_BY_ID,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateItemCharacteristicDto) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCharacteristicsPatterns.UPDATE,
      payload: { id, data },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.microserviceClient.call({
      action: 'send',
      pattern: ItemCharacteristicsPatterns.DELETE,
      payload: { id },
      onError: ({ code, message, details }) => new HttpException(message, code, { cause: details as Error }),
    });
  }
}
