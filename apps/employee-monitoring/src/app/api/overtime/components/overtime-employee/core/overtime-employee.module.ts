import { Module } from '@nestjs/common';
import { OvertimeEmployeeService } from './overtime-employee.service';
import { OvertimeEmployeeController } from './overtime-employee.controller';
import { CrudModule } from '@gscwd-api/crud';
import { OvertimeEmployee } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(OvertimeEmployee)],
  providers: [OvertimeEmployeeService],
  controllers: [OvertimeEmployeeController],
  exports: [OvertimeEmployeeService],
})
export class OvertimeEmployeeModule {}
