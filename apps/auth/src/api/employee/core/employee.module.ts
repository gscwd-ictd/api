import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { Employee } from '../data/employee.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [CrudModule.register(Employee)],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
