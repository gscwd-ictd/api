import { Test, TestingModule } from '@nestjs/testing';
import { BudgetTypeService } from '../core/budget-types.service';

describe('BudgetTypeService', () => {
  let service: BudgetTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetTypeService],
    }).compile();

    service = module.get<BudgetTypeService>(BudgetTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
