import { Module } from '@nestjs/common';
import { LmsMicroserviceClientModule } from '@gscwd-api/microservices';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';

@Module({
  imports: [LmsMicroserviceClientModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
