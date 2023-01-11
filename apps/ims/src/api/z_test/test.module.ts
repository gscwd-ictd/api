import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestEntity } from './test.entity';
import { TestService } from './test.service';

@Module({
  imports: [CrudModule.register(TestEntity)],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
