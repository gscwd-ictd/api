import { Global, Module } from '@nestjs/common';
import { UserLogsService } from './user-logs.service';
import { UserLogsController } from './user-logs.controller';
import { CrudModule } from '@gscwd-api/crud';
import { UserLogs } from '@gscwd-api/models';
import { EmployeesModule } from '../../employees/core/employees.module';
import { EmployeesService } from '../../employees/core/employees.service';

@Global()
@Module({
  imports: [CrudModule.register(UserLogs), EmployeesModule],
  providers: [UserLogsService],
  controllers: [UserLogsController],
  exports: [UserLogsService, EmployeesModule],
})
export class UserLogsModule {}
