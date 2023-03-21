import { Test, TestingModule } from '@nestjs/testing';
import { LaborCostService } from '../core/labor-costs.service';

describe('LaborCostService', () => {
  let service: LaborCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LaborCostService],
    }).compile();

    service = module.get<LaborCostService>(LaborCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
