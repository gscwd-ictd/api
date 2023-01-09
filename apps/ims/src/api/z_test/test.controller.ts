import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { TestService } from './test.service';
import * as data from '../../../mock/people';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.testService.findAll({ page, limit });
  }

  @Get('mock/people')
  async findAllPeople() {
    return data.MOCK_PEOPLE;
  }
}
