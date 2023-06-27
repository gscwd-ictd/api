import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { LmsMicroserviceClientModule } from '@gscwd-api/microservices';
import { ManagersController } from './managers.controller';
import { EmployeesModule } from '../../employees';

@Module({
  imports: [EmployeesModule, LmsMicroserviceClientModule],
  controllers: [ManagersController],
  providers: [ManagersService],
  exports: [ManagersService],
})
export class ManagersModule {}
