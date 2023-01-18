import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly service: TestService) {}

  @Get()
  async findAllItems(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.service.findAllItems({ page, limit });
  }

  @Get(':id')
  async findItemById(@Param('id') id: string) {
    return await this.service.findItemById(id);
  }
}
