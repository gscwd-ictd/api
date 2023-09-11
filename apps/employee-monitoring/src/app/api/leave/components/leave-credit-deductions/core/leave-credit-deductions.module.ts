import { Module } from '@nestjs/common';
import { LeaveCreditDeductionsService } from './leave-credit-deductions.service';
import { LeaveCreditDeductionsController } from './leave-credit-deductions.controller';
import { CrudHelper, CrudModule, CrudService } from '@gscwd-api/crud';
import { LeaveCreditDeductions } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(LeaveCreditDeductions)],
  providers: [LeaveCreditDeductionsService],
  controllers: [LeaveCreditDeductionsController],
  exports: [LeaveCreditDeductionsService],
})
export class LeaveCreditDeductionsModule {}
