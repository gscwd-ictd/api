import { Test, TestingModule } from '@nestjs/testing';
import { LeaveBenefitsService } from '../core/leave-benefits.service';

describe('LeaveBenefitsService', () => {
  let service: LeaveBenefitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveBenefitsService],
    }).compile();

    service = module.get<LeaveBenefitsService>(LeaveBenefitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
