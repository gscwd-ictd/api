import { Module } from '@nestjs/common';
import { PortalEmployeesService } from './portal-employees.service';
import { PortalMicroserviceClientModule } from '@gscwd-api/microservices';
import { PortalEmployeesController } from './portal-employees.controller';

@Module({
  imports: [PortalMicroserviceClientModule],
  controllers: [PortalEmployeesController],
  providers: [PortalEmployeesService],
  exports: [PortalEmployeesService],
})
export class PortalEmployeesModule {}
