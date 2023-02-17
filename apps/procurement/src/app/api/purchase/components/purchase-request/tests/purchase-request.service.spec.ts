import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRequestService } from '../core/purchase-request.service';

describe('PurchaseRequestService', () => {
  let service: PurchaseRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseRequestService],
    }).compile();

    service = module.get<PurchaseRequestService>(PurchaseRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
