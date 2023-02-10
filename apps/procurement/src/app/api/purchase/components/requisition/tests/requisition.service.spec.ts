import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRequisitionService } from '../core/requisition.service';

describe('RequisitionService', () => {
  let service: PurchaseRequisitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseRequisitionService],
    }).compile();

    service = module.get<PurchaseRequisitionService>(PurchaseRequisitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
