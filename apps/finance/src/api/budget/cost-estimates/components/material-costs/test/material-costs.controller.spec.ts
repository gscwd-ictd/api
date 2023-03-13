import { Test, TestingModule } from '@nestjs/testing';
import { MaterialCostController } from '../core/material-costs.controller';

describe('MaterialCostController', () => {
  let controller: MaterialCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialCostController],
    }).compile();

    controller = module.get<MaterialCostController>(MaterialCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
