import { Module } from '@nestjs/common';
import { LmsMicroserviceClientModule } from '@gscwd-api/microservices';
import { EmployeesService } from './employees.service';

@Module({
  imports: [LmsMicroserviceClientModule],
  controllers: [],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
