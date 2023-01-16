import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './data/test.dto';

@Controller('test')
export class TestController {
  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return user;
  }
}
