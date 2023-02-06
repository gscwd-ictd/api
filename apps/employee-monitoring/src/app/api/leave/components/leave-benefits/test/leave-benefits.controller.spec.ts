import { Test, TestingModule } from '@nestjs/testing';
import { LeaveBenefitsController } from '../core/leave-benefits.controller';

describe('LeaveBenefitsController', () => {
  let controller: LeaveBenefitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveBenefitsController],
    }).compile();

    controller = module.get<LeaveBenefitsController>(LeaveBenefitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
