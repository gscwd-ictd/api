import { Test, TestingModule } from '@nestjs/testing';
import { LaborCostController } from '../core/labor-cost.controller';
import { LaborCostService } from '../core/labor-cost.service';

describe('LaborCostController', () => {
  let controller: LaborCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaborCostController],
      providers: [LaborCostService],
    }).compile();

    controller = module.get<LaborCostController>(LaborCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
