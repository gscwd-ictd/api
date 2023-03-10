import { Test, TestingModule } from '@nestjs/testing';
import { BudgetDetailService } from '../core/budget-details.service';

describe('BudgetDetailService', () => {
  let service: BudgetDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetDetailService],
    }).compile();

    service = module.get<BudgetDetailService>(BudgetDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
