import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseDetailsController } from '../core/pr-details.controller';

describe('PurchaseDetailsController', () => {
  let controller: PurchaseDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseDetailsController],
    }).compile();

    controller = module.get<PurchaseDetailsController>(PurchaseDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
