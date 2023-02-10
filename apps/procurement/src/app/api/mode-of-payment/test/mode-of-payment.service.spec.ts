import { Test, TestingModule } from '@nestjs/testing';
import { ModeOfPaymentService } from './mode-of-payment.service';

describe('ModeOfPaymentService', () => {
  let service: ModeOfPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModeOfPaymentService],
    }).compile();

    service = module.get<ModeOfPaymentService>(ModeOfPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
