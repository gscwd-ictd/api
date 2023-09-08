import { Module } from '@nestjs/common';
import { OvertimeApprovalService } from './overtime-approval.service';
import { OvertimeApprovalController } from './overtime-approval.controller';
import { CrudModule } from '@gscwd-api/crud';
import { OvertimeApproval } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(OvertimeApproval)],
  providers: [OvertimeApprovalService],
  controllers: [OvertimeApprovalController],
  exports: [OvertimeApprovalService],
})
export class OvertimeApprovalModule {}
