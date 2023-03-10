import { Test, TestingModule } from '@nestjs/testing';
import { BudgetDetailController } from '../core/budget-details.controller';

describe('BudgetDetailController', () => {
  let controller: BudgetDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetDetailController],
    }).compile();

    controller = module.get<BudgetDetailController>(BudgetDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
