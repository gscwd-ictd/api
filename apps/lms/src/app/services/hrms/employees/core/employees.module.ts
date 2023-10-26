import { Module } from '@nestjs/common';
import { HrmsMicroserviceClientModule } from '@gscwd-api/microservices';
import { HrmsEmployeesService } from './employees.service';
import { HrmsEmployeesController } from './employees.controller';

@Module({
  imports: [HrmsMicroserviceClientModule],
  controllers: [HrmsEmployeesController],
  providers: [HrmsEmployeesService],
  exports: [HrmsEmployeesService],
})
export class HrmsEmployeesModule {}
