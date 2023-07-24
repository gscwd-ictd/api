import { Test, TestingModule } from '@nestjs/testing';
import { LeaveCreditEarningsService } from '../core/leave_credit_earnings.service';

describe('LeaveCreditEarningsService', () => {
  let service: LeaveCreditEarningsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveCreditEarningsService],
    }).compile();

    service = module.get<LeaveCreditEarningsService>(LeaveCreditEarningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
