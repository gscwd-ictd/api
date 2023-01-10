import { Test, TestingModule } from '@nestjs/testing';
import { ContractorProfitService } from '../core/contractor-profit.service';

describe('ContractorProfitService', () => {
  let service: ContractorProfitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContractorProfitService],
    }).compile();

    service = module.get<ContractorProfitService>(ContractorProfitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
