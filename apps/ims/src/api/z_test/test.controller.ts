import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import * as data from '../../../mock/people';
import { TestControllerGuard, TestRouteGuard } from './test.guard';

@UseGuards(TestControllerGuard)
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

  @UseGuards(TestRouteGuard)
  @Get('mock/people')
  async findAllPeople() {
    return data.MOCK_PEOPLE;
  }
}
