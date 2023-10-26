import { Module } from '@nestjs/common';
import { HrmsMicroserviceClientModule } from '@gscwd-api/microservices';
import { HrmsEmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';

@Module({
  imports: [HrmsMicroserviceClientModule],
  controllers: [EmployeesController],
  providers: [HrmsEmployeesService],
  exports: [HrmsEmployeesService],
})
export class HrmsEmployeesModule {}
