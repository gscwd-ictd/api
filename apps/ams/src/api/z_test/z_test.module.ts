import { Module } from '@nestjs/common';
import { ZTestService } from './z_test.service';
import { ZTestController } from './z_test.controller';

@Module({
  imports: [],
  providers: [ZTestService],
  controllers: [ZTestController],
})
export class ZTestModule {}
