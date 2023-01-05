import { Test, TestingModule } from '@nestjs/testing';
import { MaterialCostService } from '../core/material-cost.service';

describe('MaterialCostService', () => {
  let service: MaterialCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaterialCostService],
    }).compile();

    service = module.get<MaterialCostService>(MaterialCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
