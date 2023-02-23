import { CrudModule } from '@gscwd-api/crud';
import { ModeofPayment } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { ModeOfPaymentController } from './mode-of-payment.controller';
import { ModeOfPaymentService } from './mode-of-payment.service';

@Module({
  imports: [CrudModule.register(ModeofPayment)],
  controllers: [ModeOfPaymentController],
  providers: [ModeOfPaymentService],
  exports: [ModeOfPaymentService],
})
export class ModeOfPaymentModule {}
