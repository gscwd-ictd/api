import { Module } from '@nestjs/common';
import { HrmsMicroserviceClientModule } from '@gscwd-api/microservices';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';

@Module({
  imports: [HrmsMicroserviceClientModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
