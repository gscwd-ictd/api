import { MicroserviceClient, MS_CLIENT } from '@gscwd-api/microservices';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ImsMicroservice } from '../../config';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [ClientsModule.registerAsync([{ name: MS_CLIENT, useClass: ImsMicroservice }])],
  providers: [TestService, MicroserviceClient],
  controllers: [TestController],
  exports: [TestService],
})
export class TestModule {}
