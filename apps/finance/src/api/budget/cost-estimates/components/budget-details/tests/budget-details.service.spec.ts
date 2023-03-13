import { Test, TestingModule } from '@nestjs/testing';
import { BudgetDetailsService } from '../core/budget-details.service';

describe('BudgetDetailsService', () => {
  let service: BudgetDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetDetailsService],
    }).compile();

    service = module.get<BudgetDetailsService>(BudgetDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
