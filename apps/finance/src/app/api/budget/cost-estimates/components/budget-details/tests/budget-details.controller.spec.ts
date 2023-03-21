import { Test, TestingModule } from '@nestjs/testing';
import { BudgetDetailsController } from '../core/budget-details.controller';

describe('BudgetDetailsController', () => {
  let controller: BudgetDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetDetailsController],
    }).compile();

    controller = module.get<BudgetDetailsController>(BudgetDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
