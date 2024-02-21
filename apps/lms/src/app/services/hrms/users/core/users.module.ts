import { Module } from '@nestjs/common';
import { HrmsUsersController } from './users.controller';
import { HrmsUsersService } from './users.service';
import { HrmsMicroserviceClientModule } from '@gscwd-api/microservices';

@Module({
  imports: [HrmsMicroserviceClientModule],
  controllers: [HrmsUsersController],
  providers: [HrmsUsersService],
  exports: [HrmsUsersService],
})
export class HrmsUsersModule {}
