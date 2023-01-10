import { Test, TestingModule } from '@nestjs/testing';
import { ContractorProfitController } from '../core/contractor-profit.controller';

describe('ContractorProfitController', () => {
  let controller: ContractorProfitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractorProfitController],
    }).compile();

    controller = module.get<ContractorProfitController>(ContractorProfitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
