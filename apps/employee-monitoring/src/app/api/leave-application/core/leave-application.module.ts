import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveApplication } from '../../../../../../../libs/models/src/lib/databases/employee-monitoring/data/leave-application/leave-application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveApplication])],
  providers: [],
  controllers: [],
  exports: [],
})
export class LeaveApplicationModule {}
