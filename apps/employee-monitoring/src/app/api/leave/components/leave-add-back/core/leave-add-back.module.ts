import { Module } from '@nestjs/common';
import { LeaveAddBackService } from './leave-add-back.service';
import { LeaveAddBackController } from './leave-add-back.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LeaveAddBack } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(LeaveAddBack)],
  providers: [LeaveAddBackService],
  controllers: [LeaveAddBackController],
  exports: [LeaveAddBackService],
})
export class LeaveAddBackModule {}
