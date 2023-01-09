import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
