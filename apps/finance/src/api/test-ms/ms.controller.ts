import { Controller, Get } from '@nestjs/common';
import { TestService } from './ms.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async test() {
    this.testService.test();
  }
}
