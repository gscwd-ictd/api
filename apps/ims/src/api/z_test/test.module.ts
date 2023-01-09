import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
