import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseDetailsService } from '../core/pr-details.service';

describe('PurchaseDetailsService', () => {
  let service: PurchaseDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseDetailsService],
    }).compile();

    service = module.get<PurchaseDetailsService>(PurchaseDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
