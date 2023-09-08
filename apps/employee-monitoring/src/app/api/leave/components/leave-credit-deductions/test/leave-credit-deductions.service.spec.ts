import { Test, TestingModule } from '@nestjs/testing';
import { LeaveCreditDeductionsService } from '../core/leave-credit-deductions.service';

describe('LeaveCreditDeductionsService', () => {
  let service: LeaveCreditDeductionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveCreditDeductionsService],
    }).compile();

    service = module.get<LeaveCreditDeductionsService>(LeaveCreditDeductionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
