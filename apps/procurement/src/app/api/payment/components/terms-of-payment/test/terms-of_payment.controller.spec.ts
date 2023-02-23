import { Test, TestingModule } from '@nestjs/testing';
import { TermsOfPaymentController } from '../core/terms-of_payment.controller';

describe('TermsOfPaymentController', () => {
  let controller: TermsOfPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TermsOfPaymentController],
    }).compile();

    controller = module.get<TermsOfPaymentController>(TermsOfPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
