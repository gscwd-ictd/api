import { Test, TestingModule } from '@nestjs/testing';
import { BudgetTypeController } from '../core/budget-types.controller';
import { BudgetTypeService } from '../core/budget-types.service';

describe('BudgetTypeController', () => {
  let controller: BudgetTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetTypeController],
      providers: [BudgetTypeService],
    }).compile();

    controller = module.get<BudgetTypeController>(BudgetTypeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
