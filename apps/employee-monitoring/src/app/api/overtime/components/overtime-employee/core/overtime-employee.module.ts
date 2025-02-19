import { Module } from '@nestjs/common';
import { OvertimeEmployeeService } from './overtime-employee.service';
import { OvertimeEmployeeController } from './overtime-employee.controller';
import { CrudModule } from '@gscwd-api/crud';
import { OvertimeEmployee } from '@gscwd-api/models';
import { EmployeesModule } from '../../../../employees/core/employees.module';
import { OvertimeApplicationModule } from '../../overtime-application/core/overtime-application.module';
import { OvertimeEmployeeMsController } from './overtime-employee-ms.controller';
import { OvertimeAccomplishmentModule } from '../../overtime-accomplishment/core/overtime-accomplishment.module';

@Module({
  imports: [CrudModule.register(OvertimeEmployee), EmployeesModule, OvertimeApplicationModule, OvertimeAccomplishmentModule],
  providers: [OvertimeEmployeeService],
  controllers: [OvertimeEmployeeController, OvertimeEmployeeMsController],
  exports: [OvertimeEmployeeService],
})
export class OvertimeEmployeeModule { }
