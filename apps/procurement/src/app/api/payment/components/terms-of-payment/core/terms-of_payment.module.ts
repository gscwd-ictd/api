import { CrudModule } from '@gscwd-api/crud';
import { TermsofPayment } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TermsOfPaymentController } from './terms-of_payment.controller';
import { TermsOfPaymentService } from './terms-of_payment.service';

@Module({
  imports: [CrudModule.register(TermsofPayment)],
  controllers: [TermsOfPaymentController],
  providers: [TermsOfPaymentService],
  exports: [TermsOfPaymentService],
})
export class TermsOfPaymentModule {}
