import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentCostService } from '../core/equipment-costs.service';

describe('EquipmentCostService', () => {
  let service: EquipmentCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentCostService],
    }).compile();

    service = module.get<EquipmentCostService>(EquipmentCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
