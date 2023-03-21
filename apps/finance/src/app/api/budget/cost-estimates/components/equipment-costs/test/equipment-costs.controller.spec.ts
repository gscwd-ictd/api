import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentCostController } from '../core/equipment-costs.controller';
import { EquipmentCostService } from '../core/equipment-costs.service';

describe('EquipmentCostController', () => {
  let controller: EquipmentCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipmentCostController],
      providers: [EquipmentCostService],
    }).compile();

    controller = module.get<EquipmentCostController>(EquipmentCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
