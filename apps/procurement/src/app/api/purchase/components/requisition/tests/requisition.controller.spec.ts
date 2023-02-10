import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRequisitionController } from '../core/requisition.controller';

describe('RequisitionController', () => {
  let controller: PurchaseRequisitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseRequisitionController],
    }).compile();

    controller = module.get<PurchaseRequisitionController>(PurchaseRequisitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
