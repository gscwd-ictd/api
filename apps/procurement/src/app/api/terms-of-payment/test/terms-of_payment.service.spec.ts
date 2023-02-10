import { Test, TestingModule } from '@nestjs/testing';
import { TermsOfPaymentService } from '../core/terms-of_payment.service';

describe('TermsOfPaymentService', () => {
  let service: TermsOfPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TermsOfPaymentService],
    }).compile();

    service = module.get<TermsOfPaymentService>(TermsOfPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
